import { Injectable } from '@angular/core';
import { SandboxAgendaConfig } from '@crczp/sandbox-agenda';

@Injectable()
export class SandboxAgendaContext {
    private readonly _config: SandboxAgendaConfig;

    get config(): SandboxAgendaConfig {
        return this._config;
    }

    constructor(config: SandboxAgendaConfig) {
        this._config = config;
    }
}
