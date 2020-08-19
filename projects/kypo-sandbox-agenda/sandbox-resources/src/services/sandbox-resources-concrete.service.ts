import { tap } from 'rxjs/operators';
import { ResourcesApi } from 'kypo-sandbox-api';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resources } from 'kypo-sandbox-model';
import { SandboxResourcesService } from './sandbox-resources.service';

@Injectable()
export class SandboxResourcesConcreteService extends SandboxResourcesService {
  private resourcesSubject$: ReplaySubject<Resources> = new ReplaySubject();
  resources$: Observable<Resources> = this.resourcesSubject$.asObservable();

  constructor(private resourcesApi: ResourcesApi) {
    super();
  }

  getResources(): Observable<Resources> {
    return this.resourcesApi.getResources().pipe(
      tap((resource) => {
        this.resourcesSubject$.next(resource);
      })
    );
  }
}
