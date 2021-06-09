import * as commander from "commander";
import * as shelljs from "shelljs";
import * as inquirer from "inquirer";

import { UltronTerminalExecutor } from "./cli";

(() => {
  const commanderInstance = new commander.Command();

  return UltronTerminalExecutor.getInstance(
    commanderInstance,
    shelljs,
    inquirer
  );
})();
