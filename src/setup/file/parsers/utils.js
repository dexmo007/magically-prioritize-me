export async function readFileAsync(file, read = 'readAsText') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader[read](file);
  });
}
