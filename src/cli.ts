import * as commander from "commander";
import * as shelljs from "shelljs";
import * as inquirer from "inquirer";

const performanceFactory = {
  startTime: 0,
  endTime: 0,
  start() {
    this.startTime = performance.now();
  },

  end() {
    this.endTime = performance.now();

    return this.startTime - this.endTime;
  },
};

export class UltronTerminalExecutor {
  private static INSTANCE: UltronTerminalExecutor;

  public static getInstance(
    commandHandler: commander.Command,
    shellExecutor: typeof shelljs,
    terminalInputted: typeof inquirer
  ) {
    if (!this.INSTANCE) {
      this.INSTANCE = new UltronTerminalExecutor(
        commandHandler,
        shellExecutor,
        terminalInputted
      );
    }
    return this.INSTANCE;
  }

  constructor(
    private commandHandler: commander.Command,
    private shellExecutor: typeof shelljs,
    private terminalInputted: typeof inquirer
  ) {
    this.initCli();
  }

  private getEnvs() {
    return {
      produto: process.env.PROJECT_PRODUTO_PATH,
      assistencia: process.env.PROJECT_ASSISTENCIA_PATH,
      ultronMainProject: process.env.PROJECT_ULTRON_MAIN_PATH,
    };
  }

  private async initCli() {
    try {
      this.commandHandler.option("--e, --env envType", "environment", "red");

      const project: { project: "produto" | "assistencia" } =
        await this.terminalInputted.prompt([
          {
            type: "list",
            name: "projectName",
            message: "selecione o projeto",
            choices: ["produto", "assistencia"],
          },
        ]);

      const projectsPaths = this.getEnvs();

      const currentProjectPath: string = projectsPaths[project as any];

      this.shellExecutor.exec(`code ${currentProjectPath}`);

      this.shellExecutor.cd(projectsPaths.ultronMainProject);

      const flagOptions = this.commandHandler.opts();

      this.shellExecutor.exec(`yarn start:${flagOptions.env}`);
    } catch (error) {
      console.error(error);
    }
  }
}
