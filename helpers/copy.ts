import chalk from 'chalk';
import ncp from 'ncp';
import { MESSAGES } from '../utils/messages';
import path from 'path';

export const copyFiles = (projectConfigPath: string, destinationPath: string, projectName: string) => {
  ncp(projectConfigPath, destinationPath, {
    filter: (source) => {
      // Exclude the package.json file
      const nombreArchivo = path.basename(source);
      return nombreArchivo !== 'package.json'
    }
  }, function (error) {
    if (error) {
      console.error(chalk.red(MESSAGES.CONFIG_INIT_FAILED));
    } else {
      console.log(chalk.green(MESSAGES.CONFIG_INIT_SUCCEED(projectName)))
    }
  })
};