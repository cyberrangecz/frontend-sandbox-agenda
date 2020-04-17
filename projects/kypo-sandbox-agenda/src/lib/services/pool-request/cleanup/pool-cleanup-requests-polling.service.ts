import { PoolRequestsPollingService } from '../pool-requests-polling.service';

export abstract class PoolCleanupRequestsPollingService extends PoolRequestsPollingService {
  protected constructor(pageSize: number, pollPeriod: number) {
    super(pageSize, pollPeriod);
  }
}
