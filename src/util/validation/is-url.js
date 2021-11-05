export default function isUrl(potentionalUrl) {
  try {
    const url = new URL(potentionalUrl);
    return !!url.protocol.match(/^https?/);
  } catch {
    return false;
  }
}
