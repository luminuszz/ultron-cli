import * as commander from "commander";
import * as shelljs from "shelljs";
import * as inquirer from "inquirer";

type ProjectResponse = {
  projectName: "produto" | "assistencia";
};

type EnvironmentResponse = { type: "dev" | "hml" };

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
      const project: ProjectResponse = await this.terminalInputted.prompt([
        {
          type: "list",
          name: "projectName",
          message: "selecione o projeto",
          choices: ["produto", "assistencia"],
        },
      ]);

      const environment: EnvironmentResponse =
        await this.terminalInputted.prompt([
          {
            type: "list",
            name: "type",
            message: "Selecione o ambiente",
            choices: ["dev", "hml", "test"],
          },
        ]);

      const projectsPaths = this.getEnvs();

      const currentProjectDirectory: string =
        projectsPaths[project.projectName as any];

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
