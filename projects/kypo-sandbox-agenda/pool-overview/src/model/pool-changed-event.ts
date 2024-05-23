import { Pool } from '@muni-kypo-crp/sandbox-model';

/**
 * Event emitted when edited group-overview is changed
 */
export class PoolChangedEvent {
  pool: Pool;
  isValid: boolean;

  constructor(pool: Pool, isValid: boolean) {
    this.pool = pool;
    this.isValid = isValid;
  }
}
