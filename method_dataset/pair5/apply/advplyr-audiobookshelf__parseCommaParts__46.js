function parseCommaParts(str) {
  if (!str)
    return [''];

  const parts = [];
  const m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  const { pre, body, post } = m;
  const p = pre.split(',');

  p[p.length - 1] += '{' + body + '}';
  const postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length - 1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}
