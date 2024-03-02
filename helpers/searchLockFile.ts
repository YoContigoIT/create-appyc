import { readdir } from "fs/promises";

const packageManagers = {
  "package-lock.json": "npm",
  "yarn.lock": "yarn",
  "pnpm-lock.yaml": "pnpm",
};

export async function searchLockFile(destinationPath): Promise<string> {
  // Read the directory
  const files = await readdir(destinationPath);

  // Regular expression to match the lock files
  const regex = /^(yarn\.lock|package-lock\.json|pnpm-lock\.yaml)$/;

  // Filter the files
  const matchedFiles = files.find((file) => regex.test(file));

  return packageManagers[matchedFiles ?? "npm"]; // Return the matched files
}
