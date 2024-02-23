import { readFile } from 'fs/promises';
export * from './install';

export const extractPackageManager = (filePath: string) => {
  const match = filePath.match(/\/(pnpm|npm|yarn)/);
  return match ? match[1] : null;
}

export async function readPackageJson(filePath: string) {
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}