import {Injectable} from '@angular/core';
import {SandboxAgendaConfig} from '../../model/sandbox-agenda-config';

@Injectable()
export class KypoSandboxAgendaContext {

  private readonly _config: SandboxAgendaConfig;

  get config(): SandboxAgendaConfig {
    return this._config;
  }

  constructor(config: SandboxAgendaConfig) {
    this._config = config;
  }

}
