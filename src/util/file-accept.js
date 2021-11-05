export default function fileAccept(accept, files) {
  if (!accept) {
    return true;
  }
  const regexes = accept
    .split(',')
    .map((s) => new RegExp(s.trim().replace('*', '.*'), 'i'));
  return files.every((file) => regexes.some((re) => re.test(file.type)));
}
