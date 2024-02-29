import { readdir } from "fs/promises";

export async function searchLockFile(destinationPath) {
  try {
    // Read the directory
    const files = await readdir(destinationPath);

    // Regular expression to match the lock files
    const regex = /^(yarn\.lock|package-lock\.json|pnpm-lock\.yaml)$/;

    // Filter the files
    const matchedFiles = files.filter((file) => regex.test(file));

    return matchedFiles; // Return the matched files
  } catch (err) {
    console.error("Error al leer el directorio:", err);
    return []; // Return an empty array
  }
}
