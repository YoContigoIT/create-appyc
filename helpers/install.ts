import chalk from 'chalk';
import { glob } from 'glob';
import { spawn } from 'child_process';
import os from "os";
import path from 'path'
import { extractPackageManager, readPackageJson } from '.';
import { MESSAGES } from '../utils/messages';
import { writeFile } from 'fs/promises';

export const installDependenciesInNewProject = async (destinationPath: string, packageManager: string, projectName: string) => {
  const installProcess = spawn(packageManager, ['install'], {
    stdio: 'inherit',
    cwd: destinationPath
  });

  installProcess.on('exit', (code) => {
    if (code === 0) {
      console.info(chalk.green(MESSAGES.PACKAGE_MANAGER_INSTALLATION_SUCCEED(packageManager)));
      console.log('Inside that directory, you can run several commands:')
      console.log()
      console.log(chalk.cyan(`  ${packageManager} ${packageManager !== 'npm' ? '' : 'run '}dev`))
      console.log('    Starts the development server.')
      console.log()
      console.log(chalk.cyan(`  ${packageManager} ${packageManager !== 'npm' ? '' : 'run '}build`))
      console.log('    Builds the app for production.')
      console.log()
      console.log(chalk.cyan(`  ${packageManager} start`))
      console.log('    Runs the built app in production mode.')
      console.log()
      console.log('We suggest that you begin by typing:')
      console.log()
      console.log(chalk.cyan('  cd'), projectName)
      console.log(`  ${chalk.cyan(`${packageManager} ${packageManager !== 'npm' ? '' : 'run '}dev`)}`)
    } else {
      chalk.red(
        MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
          chalk.bold(packageManager),
        ),
      )
    }
  });

  // Handle errors during the installation process
  installProcess.on('error', (error) => {
    chalk.red(
      MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
        chalk.bold(packageManager),
      ),
    )
  })
}

export const installConfigDependencies = async (sourcePath: string, destinationPath: string) => {
  const packageJSONOrigin = await readPackageJson(sourcePath);
  const packageJSONDestination = await readPackageJson(path.join(destinationPath, "package.json"));

  const [packageLock] = await glob(path.join(destinationPath, '{yarn.lock,package-lock.json,pnpm-lock.yaml}'))

  const mergedPackageJSON = {
    ...packageJSONDestination,
    // Merge scripts
    script: {
      ...packageJSONDestination.scripts,
      ...packageJSONOrigin.scripts,
    },
    // Merge dependencies
    dependencies: {
      ...packageJSONDestination.dependencies,
      ...packageJSONOrigin.dependencies
    },
    // Merge devDependencies
    devDependencies: {
      ...packageJSONDestination.devDependencies,
      ...packageJSONOrigin.devDependencies
    },
    jest: {
      ...packageJSONDestination.jest,
      ...packageJSONOrigin.jest
    }
  };

  await writeFile(
    path.join(destinationPath, "package.json"),
    JSON.stringify(mergedPackageJSON, null, 2) + os.EOL
  );

  const packageManager = extractPackageManager(packageLock) ?? 'npm'
  const args = ['install'];


  const installProcess = spawn(packageManager, args, {
    stdio: 'inherit',
    cwd: destinationPath
  });

  installProcess.on('exit', (code) => {
    if (code === 0) {
      console.info(chalk.green(MESSAGES.DEPENDENCIES_INSTALLATION_SUCCEED(packageManager)));
    } else {
      chalk.red(
        MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
          chalk.bold(packageManager),
        ),
      )
    }
  });

  // Handle errors during the installation process
  installProcess.on('error', (error) => {
    chalk.red(
      MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
        chalk.bold(packageManager),
      ),
    )
  })
}