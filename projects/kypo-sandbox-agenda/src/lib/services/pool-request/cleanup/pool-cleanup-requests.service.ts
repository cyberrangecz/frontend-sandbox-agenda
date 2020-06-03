import { PoolRequestsService } from '../pool-requests.service';

export abstract class PoolCleanupRequestsService extends PoolRequestsService {
  protected constructor(pageSize: number, pollPeriod: number) {
    super(pageSize, pollPeriod);
  }
}
