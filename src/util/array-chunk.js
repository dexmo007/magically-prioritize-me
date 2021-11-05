export default function arrayChunk(arr, n) {
  if (arr.length < n) {
    return arr.map((e) => [e]);
  }
  const minChunkSize = Math.floor(arr.length / n);
  const chunks = [];
  let offset = 0;
  for (let i = 0; i < n; i += 1) {
    const chunkSize = minChunkSize + (i < arr.length % n ? 1 : 0);
    const chunk = arr.slice(offset, offset + chunkSize);
    offset += chunkSize;
    chunks.push(chunk);
  }
  return chunks;
}
