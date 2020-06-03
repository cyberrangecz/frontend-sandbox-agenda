import { AllocationRequest } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { PoolRequestsService } from '../pool-requests.service';

export abstract class PoolAllocationRequestsService extends PoolRequestsService {
  protected constructor(pageSize: number, pollPeriod: number) {
    super(pageSize, pollPeriod);
  }

  abstract cancel(request: AllocationRequest): Observable<any>;

  abstract delete(request: AllocationRequest): Observable<any>;
}
