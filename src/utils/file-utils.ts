export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
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