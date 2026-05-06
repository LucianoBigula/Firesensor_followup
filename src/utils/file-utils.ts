export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const base64ToBlob = (base64: string, type: string) => {
  const base64Data = base64.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
};

export const MAX_FILE_SIZE = 1024 * 1024; // 1MB em bytes

export const validatePdfFile = (file: File): string | null => {
  if (file.type !== "application/pdf") {
    return "O arquivo deve ser um PDF.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "O arquivo deve ter no máximo 1MB.";
  }
  return null;
};