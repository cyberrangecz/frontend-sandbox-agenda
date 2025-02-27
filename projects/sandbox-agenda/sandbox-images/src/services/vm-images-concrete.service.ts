import { SandboxErrorHandler } from '@crczp/sandbox-agenda';
import { SandboxAgendaContext } from '@crczp/sandbox-agenda/internal';
import { VMImagesApi } from '@crczp/sandbox-api';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { VirtualImage } from '@crczp/sandbox-model';
import { SentinelFilter } from '@sentinel/common/filter';
import { OffsetPaginationEvent, PaginatedResource } from '@sentinel/common/pagination';
import { VMImagesService } from './vm-images.service';

@Injectable()
export class VMImagesConcreteService extends VMImagesService {
    constructor(
        private vmImagesApi: VMImagesApi,
        private context: SandboxAgendaContext,
        private errorHandler: SandboxErrorHandler,
    ) {
        super(context.config.defaultPaginationSize);
    }

    /**
     * Retrieves paginated available virtual machine images
     * @param pagination requested pagination
     * @param onlyCrczpImages filters images belonging to CyberRangeᶜᶻ Platform
     * @param onlyGuiAccess filters images with GUI access
     * @param cached Performs the faster version of this endpoint but does not retrieve a fresh list of images
     * @param filter list of sentinel filters to filter results
     *
     */
    getAvailableImages(
        pagination: OffsetPaginationEvent,
        onlyCrczpImages?: boolean,
        onlyGuiAccess?: boolean,
        cached?: boolean,
        filter?: string,
    ): Observable<PaginatedResource<VirtualImage>> {
        this.isLoadingSubject$.next(true);
        const filters = filter ? [new SentinelFilter('name', filter)] : [];
        return this.vmImagesApi.getAvailableImages(pagination, onlyCrczpImages, onlyGuiAccess, cached, filters).pipe(
            tap(
                (resource) => {
                    this.resourceSubject$.next(resource);
                    this.isLoadingSubject$.next(false);
                },
                (err) => {
                    this.errorHandler.emit(err, 'Fetching images');
                    this.hasErrorSubject$.next(true);
                    this.isLoadingSubject$.next(false);
                },
            ),
        );
    }
}
