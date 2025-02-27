import { PaginationService } from '@crczp/sandbox-agenda/internal';
import { map } from 'rxjs/operators';
import { VirtualImage } from '@crczp/sandbox-model';
import { OffsetPaginationEvent, PaginationBaseEvent } from '@sentinel/common/pagination';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SentinelTable, TableLoadEvent } from '@sentinel/components/table';
import { VMImagesService } from '../services/vm-images.service';
import { VirtualImagesTable } from '../models/virtual-images-table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'crczp-images-page',
    templateUrl: './images-page.component.html',
    styleUrls: ['./images-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesPageComponent implements OnInit {
    @Input() paginationId = 'crczp-resources-page';

    images$: Observable<SentinelTable<VirtualImage>>;
    imagesTableHasError$: Observable<boolean>;
    isLoadingImages$: Observable<boolean>;

    guiAccess = false;
    crczpImages = false;
    destroyRef = inject(DestroyRef);

    private lastFilter: string;

    readonly DEFAULT_SORT_COLUMN = 'name';
    readonly DEFAULT_SORT_DIRECTION = 'asc';

    constructor(
        private vmImagesService: VMImagesService,
        private paginationService: PaginationService,
    ) {
        this.isLoadingImages$ = vmImagesService.isLoading$;
    }

    ngOnInit(): void {
        this.initTable();
    }

    onTableLoadEvent(loadEvent: TableLoadEvent): void {
        this.paginationService.setPagination(this.paginationId, loadEvent.pagination.size);
        this.lastFilter = loadEvent.filter;
        this.getAvailableImages(loadEvent.pagination, true, loadEvent.filter);
    }

    osImagesToggled(): void {
        this.crczpImages = !this.crczpImages;
        this.getAvailableImages(this.getInitialPaginationEvent(), true, this.lastFilter);
    }

    guiAccessToggled(): void {
        this.guiAccess = !this.guiAccess;
        this.getAvailableImages(this.getInitialPaginationEvent(), true, this.lastFilter);
    }

    private initTable(): void {
        const initialLoadEvent: TableLoadEvent = {
            pagination: this.getInitialPaginationEvent(),
        };

        this.images$ = this.vmImagesService.resource$.pipe(map((resource) => new VirtualImagesTable(resource)));
        this.imagesTableHasError$ = this.vmImagesService.hasError$;
        this.initialTableLoadEvent(initialLoadEvent);
    }

    initialTableLoadEvent(loadEvent: TableLoadEvent): void {
        this.paginationService.setPagination(this.paginationId, loadEvent.pagination.size);
        this.getAvailableImages(loadEvent.pagination, false);
    }

    private getAvailableImages(pagination: PaginationBaseEvent, cached: boolean, filter?: string): void {
        this.vmImagesService
            .getAvailableImages(pagination, this.crczpImages, this.guiAccess, cached, filter)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    private getInitialPaginationEvent(): OffsetPaginationEvent {
        return new OffsetPaginationEvent(
            0,
            this.paginationService.getPagination(this.paginationId),
            this.DEFAULT_SORT_COLUMN,
            this.DEFAULT_SORT_DIRECTION,
        );
    }
}
