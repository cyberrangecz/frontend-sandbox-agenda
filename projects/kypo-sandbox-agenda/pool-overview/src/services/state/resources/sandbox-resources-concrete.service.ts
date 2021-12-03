import { SandboxErrorHandler } from '@muni-kypo-crp/sandbox-agenda';
import { tap } from 'rxjs/operators';
import { ResourcesApi } from '@muni-kypo-crp/sandbox-api';
import { Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HardwareUsage } from '@muni-kypo-crp/sandbox-model';
import { SandboxLimitsService } from './sandbox-resources.service';

@Injectable()
export class SandboxLimitsConcreteService extends SandboxLimitsService {
  private limitsSubject$: ReplaySubject<HardwareUsage> = new ReplaySubject();
  limits$: Observable<HardwareUsage> = this.limitsSubject$.asObservable();

  constructor(private resourcesApi: ResourcesApi, private errorHandler: SandboxErrorHandler) {
    super();
  }

  getLimits(): Observable<HardwareUsage> {
    return this.resourcesApi.getLimits().pipe(
      tap(
        (resource) => {
          this.limitsSubject$.next(resource);
        },
        (err) => {
          this.errorHandler.emit(err, 'Fetching limits');
        }
      )
    );
  }
}
