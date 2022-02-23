import { Observable } from 'rxjs';
import { VirtualImage } from '@muni-kypo-crp/sandbox-model';
import {
  PaginatedResource,
  OffsetPaginationEvent,
  OffsetPaginatedElementsService,
  PaginationBaseEvent,
} from '@sentinel/common';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 */
export abstract class VMImagesService extends OffsetPaginatedElementsService<VirtualImage> {
  hasError$: Observable<boolean>;

  protected constructor(pageSize: number) {
    super(pageSize);
  }

  /**
   * Retrieves paginated available virtual machine images
   * @param pagination requested pagination
   */
  abstract getAvailableImages(pagination: PaginationBaseEvent): Observable<PaginatedResource<VirtualImage>>;
}
