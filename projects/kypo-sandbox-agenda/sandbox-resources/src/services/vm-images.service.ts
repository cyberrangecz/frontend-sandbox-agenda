import { Observable } from 'rxjs';
import { VirtualImage } from '@muni-kypo-crp/sandbox-model';
import { PaginatedResource, RequestedPagination, PaginatedResourceService } from '@sentinel/common';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 */
export abstract class VMImagesService extends PaginatedResourceService<VirtualImage> {
  hasError$: Observable<boolean>;

  protected constructor(pageSize: number) {
    super(pageSize);
  }

  /**
   * Retrieves paginated available virtual machine images
   * @param pagination requested pagination
   */
  abstract getAvailableImages(pagination: RequestedPagination): Observable<PaginatedResource<VirtualImage>>;
}
