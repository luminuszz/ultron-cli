const commander = require("commander");
const shelljs = require("shelljs");
const inquirer = require("inquirer");

import { UltronTerminalExecutor } from "./cli";

(() => {
  const commanderInstance = new commander.Command();

  return UltronTerminalExecutor.getInstance(
    commanderInstance,
    shelljs,
    inquirer
  );
})();
