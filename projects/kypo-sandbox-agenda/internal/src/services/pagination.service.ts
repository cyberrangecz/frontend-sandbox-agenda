import { Injectable } from '@angular/core';
import { SandboxAgendaContext } from './sandox-agenda-context.service';

@Injectable()
export class PaginationService {
  constructor(private context: SandboxAgendaContext) {}

  /**
   * Returns selected pagination size from local storage or default when none was selected yet
   */
  getPagination(): number {
    const storage = window.localStorage;
    const pagination = storage.getItem('pagination');
    return pagination ? Number(pagination) : this.context.config.defaultPaginationSize;
  }

  /**
   * Sets desired pagination for to local storage
   * @param pagination desired pagination
   */
  setPagination(pagination: number) {
    const storage = window.localStorage;
    storage.setItem('pagination', `${pagination}`);
  }
}
