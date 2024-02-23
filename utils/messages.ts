import chalk from 'chalk';
import { EMOJIS } from './emojis';

export const MESSAGES = {
  PACKAGE_MANAGER_INSTALLATION_SUCCEED: (name: string) =>
    name !== '.'
      ? `${EMOJIS.ROCKET}  Successfully created project ${chalk.green(name)}`
      : `${EMOJIS.ROCKET}  Successfully created a new project`,
  DEPENDENCIES_INSTALLATION_SUCCEED: (name: string) =>
    `${EMOJIS.ROCKET}  Dependencies installed successfully with ${chalk.green(name)}`,
  PACKAGE_MANAGER_INSTALLATION_FAILED: (commandToRunManually: string) =>
    `${EMOJIS.SCREAM}  Packages installation failed!\nIn case you don't see any errors above, consider manually running the failed command ${commandToRunManually} to see more details on why it errored out.`,
  PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS: `Package installation in progress... ${EMOJIS.COFFEE}`,
  DIRECTORY_ALREADY_EXISTS: (directory: string) =>
    `${EMOJIS.SCREAM}  The directory ${chalk.red(directory)} already exists. Aborting...`,
  CONFIG_INIT_SUCCEED: (project: string) =>
    `${EMOJIS.ROCKET}  Successfully initialized the configuration for projects of ${chalk.green(project)}`,
  CONFIG_INIT_FAILED: `${EMOJIS.SCREAM}  Configuration initialization failed!`,
};