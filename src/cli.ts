import { injectable, inject } from "tsyringe";
import { ShellInterface, ShellInterfaceToken } from "./libs/shellInterface.lib";
import { ShellManagerToken, ShellManager } from "./libs/shellManager.lib";

import { normalize } from "path";

type ShellInterfaceDTO<ChoiceKey extends string | number, ChoiceType> = Record<
  ChoiceKey,
  ChoiceType
>;

@injectable()
export class UltronTerminalExecutor {
  constructor(
    @inject(ShellManagerToken)
    private shellExecutor: ShellManager,
    @inject(ShellInterfaceToken)
    private terminalInputted: ShellInterface
  ) {
    this.initCli();
  }

  private commands = {
    dev: "cp ./.env.dev.local .env ",
    hml: "cp ./.env.hml.local .env ",
    test: "cp ./.env.test.local .env ",
  };

  private getEnvs() {
    return {
      produto: normalize(process.env.PROJECT_PRODUTO_PATH || ""),
      assistencia: normalize(process.env.PROJECT_ASSISTENCIA_PATH || ""),
      ultronMainProject: normalize(process.env.PROJECT_ULTRON_MAIN_PATH || ""),
    };
  }

  async initCli() {
    try {
      const project: ShellInterfaceDTO<
        "projectName",
        "produto" | "assistencia"
      > = await this.terminalInputted.interface.prompt([
        {
          type: "list",
          name: "projectName",
          message: "selecione o projeto",
          choices: ["produto", "assistencia"],
        },
      ]);

      const environment: ShellInterfaceDTO<"type", "dev" | "hml" | "test"> =
        await this.terminalInputted.interface.prompt([
          {
            type: "list",
            name: "type",
            message: "Selecione o ambiente",
            choices: ["dev", "hml", "test"],
          },
        ]);

      const projectsPaths = this.getEnvs() as Record<string, string>;

      const currentProjectDirectory = projectsPaths[project.projectName];

      this.shellExecutor.manager.cd(currentProjectDirectory);

      this.shellExecutor.manager.exec(this.commands[environment.type]);

      this.shellExecutor.manager.exec(`code ${currentProjectDirectory}`);

      this.shellExecutor.manager.cd(projectsPaths.ultronMainProject);

      this.shellExecutor.manager.exec(`yarn start:${environment.type}`);
    } catch (error) {
      console.error(error);
    }
  }
}
