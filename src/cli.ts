import { injectable, inject } from "tsyringe";
import { ShellInterface, ShellInterfaceToken } from "./libs/shellInterface.lib";
import { ShellManagerToken, ShellManager } from "./libs/shellManager.lib";

import { normalize } from "path";

type ShellInterfaceDTO<ChoiceKey extends string | number, ChoiceType> = Record<
  ChoiceKey,
  ChoiceType
>;

interface AnswersDTO {
  projectName: string;
  type: "dev" | "hml" | "test";
}

@injectable()
export class UltronTerminalExecutor {
  constructor(
    @inject(ShellManagerToken)
    private shellExecutor: ShellManager,
    @inject(ShellInterfaceToken)
    private terminalInputted: ShellInterface
  ) {}

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

  public async initCli() {
    try {
      console.log("foi chamada");
      const answers: AnswersDTO = await this.terminalInputted.interface.prompt([
        {
          type: "list",
          name: "projectName",
          message: "selecione o projeto",
          choices: ["produto", "assistencia"],
        },
        {
          type: "list",
          name: "type",
          message: "Selecione o ambiente",
          choices: ["dev", "hml", "test"],
        },
      ]);

      const projectsPaths = this.getEnvs() as Record<string, string>;

      const currentProjectDirectory = projectsPaths[answers.projectName];

      this.shellExecutor.manager.cd(currentProjectDirectory);

      this.shellExecutor.manager.exec(this.commands[answers.type]);

      this.shellExecutor.manager.exec(`code ${currentProjectDirectory}`);

      this.shellExecutor.manager.cd(projectsPaths.ultronMainProject);

      this.shellExecutor.manager.exec(`yarn start:${answers.type}`);
    } catch (error) {
      console.error(error);
    }
  }
}
