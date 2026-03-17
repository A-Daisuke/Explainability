export function calculator(
  a: number,
  b: number,
  operation: '+' | '-' | '*' | '/' | '^' | '%',
): number {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) {
        throw new Error('Division by zero');
      }
      return a / b;
    case '^':
      return Math.pow(a, b);
    case '%':
      if (b === 0) {
        throw new Error('Modulo by zero');
      }
      return a % b;
    default:
      throw new Error(`Invalid operation: ${operation}`);
  }
}
