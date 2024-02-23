import { program } from 'commander'
import { config, create } from './actions'

program
  .name("create-appyc")
  .usage("[global options] command")

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