import { SandboxErrorHandler } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { VMImagesApi } from '@muni-kypo-crp/sandbox-api';
import { tap } from 'rxjs/operators';
import { Observable, of, ReplaySubject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { VirtualImage } from '@muni-kypo-crp/sandbox-model';
import { PaginatedResource, RequestedPagination } from '@sentinel/common';
import { VMImagesService } from './vm-images.service';

@Injectable()
export class VMImagesConcreteService extends VMImagesService {
  constructor(
    private vmImagesApi: VMImagesApi,
    private context: SandboxAgendaContext,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.defaultPaginationSize);
  }

  /**
   * Retrieves paginated available virtual machine images
   * @param pagination requested pagination
   */
  getAvailableImages(pagination: RequestedPagination): Observable<PaginatedResource<VirtualImage>> {
    return this.vmImagesApi.getAvailableImages(pagination).pipe(
      tap(
        (resource) => {
          this.resourceSubject$.next(resource);
        },
        (err) => {
          this.errorHandler.emit(err, 'Fetching images');
          this.hasErrorSubject$.next(true);
        }
      )
    );
  }
}
