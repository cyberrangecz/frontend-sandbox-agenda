import { SandboxErrorHandler } from '@muni-kypo-crp/sandbox-agenda';
import { tap } from 'rxjs/operators';
import { ResourcesApi } from '@muni-kypo-crp/sandbox-api';
import { Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resources } from '@muni-kypo-crp/sandbox-model';
import { SandboxResourcesService } from './sandbox-resources.service';

@Injectable()
export class SandboxResourcesConcreteService extends SandboxResourcesService {
  private resourcesSubject$: ReplaySubject<Resources> = new ReplaySubject();
  resources$: Observable<Resources> = this.resourcesSubject$.asObservable();

  constructor(
    private resourcesApi: ResourcesApi,
    private errorHandler: SandboxErrorHandler,
  ) {
    super();
  }

  getResources(): Observable<Resources> {
    return this.resourcesApi.getResources().pipe(
      tap(
        (resource) => {
          this.resourcesSubject$.next(resource);
        },
        (err) => {
          this.errorHandler.emit(err, 'Fetching resources');
        },
      ),
    );
  }
}
