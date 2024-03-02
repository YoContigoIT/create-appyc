import { access } from "fs/promises";
import path from "path";

export const checkGitDirectory = async (directory) => {
    try {
      const gitPath = path.join(directory, '.git');
      await access(gitPath);
      return true;
    } catch (err) {
      return false;
    }
  }