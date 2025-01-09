export async function getFileBase64ContentOnly(file: globalThis.File): Promise<string> {
  try {
    const base64Content = await getBase64Content(file);
    return removeBase64Prefix(base64Content);
  } catch (error) {
    throw error;
  }
}

function getBase64Content(file: globalThis.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error('Failed to read file content'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    reader.readAsDataURL(file);
  });
}

function removeBase64Prefix(base64String: string): string {
  const base64ConstPart = ';base64,';
  const base64Index = base64String.indexOf(base64ConstPart);
  if (base64Index !== -1) {
    return base64String.substring(base64Index + base64ConstPart.length);
  }
  return base64String;
}
