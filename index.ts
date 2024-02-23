#!/usr/bin/env node
import { program } from 'commander'
import { config, create } from './actions'
import { version } from './package.json'

program
  .name("create-appyc")
  .version(version, '-v, --version', 'Output the current version')
  .description('Create a new project with Appyc')

program
  .command('create')
  .description('Create a new project')
  .action(create)

program
  .command('config')
  .description('Initialize the configuration')
  .action(config)

if (process.argv.length <= 2)
  console.log(program.help());
else
  program.parse();