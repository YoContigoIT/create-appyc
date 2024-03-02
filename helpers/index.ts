import { readFile } from 'fs/promises';
export * from './install';

export async function readPackageJson(filePath: string) {
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}