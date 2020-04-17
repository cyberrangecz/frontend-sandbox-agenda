import { AllocationRequest } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { PoolRequestsPollingService } from '../pool-requests-polling.service';

export abstract class PoolAllocationRequestsPollingService extends PoolRequestsPollingService {
  protected constructor(pageSize: number, pollPeriod: number) {
    super(pageSize, pollPeriod);
  }

  abstract cancel(request: AllocationRequest): Observable<any>;

  abstract delete(request: AllocationRequest): Observable<any>;
}
