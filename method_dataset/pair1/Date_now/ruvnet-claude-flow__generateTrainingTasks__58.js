function __method_wrapper__() {
  async generateTrainingTasks(complexity = 'medium') {
    const taskId = Date.now();
    const taskDir = path.join(this.realTasksDir, `task-${taskId}`);
    await fs.mkdir(taskDir, { recursive: true });

    const tasks = {
      easy: [
        {
          type: 'function',
          name: 'validateEmail',
          task: 'Create email validation function',
          code: `function validateEmail(email) {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}

module.exports = { validateEmail };`,
          test: `
const { validateEmail } = require('./index');

describe('validateEmail', () => {
  test('validates correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
  
  test('rejects invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
`
        }
      ],
      medium: [
        {
          type: 'api',
          name: 'userApi',
          task: 'Build user API endpoint',
          code: `
const express = require('express');
const app = express();

app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  const user = { id: users.length + 1, name, email };
  users.push(user);
  res.status(201).json(user);
});

module.exports = app;
`,
          test: `
const request = require('supertest');
const app = require('./index');

describe('User API', () => {
  test('GET /users returns empty array initially', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
  
  test('POST /users creates a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Test', email: 'test@test.com' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test');
  });
});
`
        }
      ],
      hard: [
        {
          type: 'algorithm',
          name: 'sortAlgorithm',
          task: 'Implement efficient sorting',
          code: `
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}

module.exports = { quickSort, mergeSort };
`,
          test: `
const { quickSort, mergeSort } = require('./index');

describe('Sorting Algorithms', () => {
  const unsorted = [3, 1, 4, 1, 5, 9, 2, 6];
  const sorted = [1, 1, 2, 3, 4, 5, 6, 9];
  
  test('quickSort sorts correctly', () => {
    expect(quickSort(unsorted)).toEqual(sorted);
  });
  
  test('mergeSort sorts correctly', () => {
    expect(mergeSort(unsorted)).toEqual(sorted);
  });
  
  test('handles empty arrays', () => {
    expect(quickSort([])).toEqual([]);
    expect(mergeSort([])).toEqual([]);
  });
});
`
        }
      ]
    };

    const selectedTasks = tasks[complexity] || tasks.medium;
    const realTasks = [];

    // Create real task files
    for (const task of selectedTasks) {
      const projectDir = path.join(taskDir, task.name);
      await fs.mkdir(projectDir, { recursive: true });
      
      // Write actual code file
      await fs.writeFile(path.join(projectDir, 'index.js'), task.code);
      
      // Write test file
      await fs.writeFile(path.join(projectDir, 'index.test.js'), task.test);
      
      // Create package.json with real dependencies
      const packageJson = {
        name: task.name,
        version: "1.0.0",
        scripts: {
          test: "jest --silent",
          lint: "eslint index.js || true",
          typecheck: "echo 'No TypeScript' || true"
        },
        devDependencies: {
          jest: "^29.0.0",
          eslint: "^8.0.0",
          supertest: "^6.0.0"
        },
        dependencies: {
          express: task.type === 'api' ? "^4.18.0" : undefined
        }
      };
      
      await fs.writeFile(
        path.join(projectDir, 'package.json'), 
        JSON.stringify(packageJson, null, 2)
      );

      realTasks.push({
        ...task,
        projectDir,
        taskId
      });
    }

    console.log(`📝 Generated ${realTasks.length} ${complexity} training tasks`);
    return realTasks;
  }

}
