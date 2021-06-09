import * as commander from "commander";
import * as shelljs from "shelljs";
import * as inquirer from "inquirer";

export class UltronTerminalExecutor {
  static INSTANCE;

  static getInstance(commandHandler, shellExecutor, terminalInputted) {
    if (!this.INSTANCE) {
      this.INSTANCE = new UltronTerminalExecutor(
        commandHandler,
        shellExecutor,
        terminalInputted
      );
    }
    return this.INSTANCE;
  }

  constructor(commandHandler, shellExecutor, terminalInputted) {
    this.commandHandler = commandHandler;
    this.shellExecutor = shellExecutor;
    this.terminalInputted = terminalInputted;
    this.initCli();
  }

  getEnvs() {
    return {
      produto: process.env.PROJECT_PRODUTO_PATH,
      assistencia: process.env.PROJECT_ASSISTENCIA_PATH,
      ultronMainProject: process.env.PROJECT_ULTRON_MAIN_PATH,
    };
  }

  async initCli() {
    try {
      const project = await this.terminalInputted.prompt([
        {
          type: "list",
          name: "projectName",
          message: "selecione o projeto",
          choices: ["produto", "assistencia"],
        },
      ]);

      const environment = await this.terminalInputted.prompt([
        {
          type: "list",
          name: "type",
          message: "Selecione o ambiente",
          choices: ["dev", "hml", "test"],
        },
      ]);

      const projectsPaths = this.getEnvs();

      const currentProjectDirectory = projectsPaths[project.projectName] || "";

      const regex = /([d])\w+/g;

      this.shellExecutor.cd(currentProjectDirectory);

      this.shellExecutor.exec(`sed -i -e '${regex}' ./.env`);

      this.shellExecutor.exec(`code ${currentProjectDirectory}`);

      this.shellExecutor.cd(projectsPaths.ultronMainProject);

      this.shellExecutor.exec(`yarn start:${environment.type}`);
    } catch (error) {
      console.error(error);
    }
  }
}
