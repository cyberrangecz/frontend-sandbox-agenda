import { PaginationService } from '@muni-kypo-crp/sandbox-agenda/internal';
import { map } from 'rxjs/operators';
import { Resources, VirtualImage } from '@muni-kypo-crp/sandbox-model';
import { OffsetPaginationEvent, PaginationBaseEvent } from '@sentinel/common/pagination';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SandboxResourcesService } from '../services/sandbox-resources.service';
import { SentinelTable, TableLoadEvent } from '@sentinel/components/table';
import { VMImagesService } from '../services/vm-images.service';
import { VirtualImagesTable } from '../models/virtual-images-table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'kypo-resources-page',
  templateUrl: './resources-page.component.html',
  styleUrls: ['./resources-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesPageComponent implements OnInit {
  readonly INIT_SORT_NAME = 'name';
  readonly INIT_SORT_DIR = 'asc';

  images$: Observable<SentinelTable<VirtualImage>>;
  imagesTableHasError$: Observable<boolean>;
  isLoadingImages$: Observable<boolean>;

  resources$: Observable<Resources>;
  guiAccess = false;
  kypoImages = false;
  destroyRef = inject(DestroyRef);

  private lastFilter: string;

  constructor(
    private sandboxResourcesService: SandboxResourcesService,
    private vmImagesService: VMImagesService,
    private paginationService: PaginationService
  ) {
    this.resources$ = this.sandboxResourcesService.resources$;
    this.isLoadingImages$ = vmImagesService.isLoading$;
  }

  ngOnInit(): void {
    this.sandboxResourcesService.getResources().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.initTable();
  }

  onTableLoadEvent(loadEvent: TableLoadEvent): void {
    this.paginationService.setPagination(loadEvent.pagination.size);
    this.lastFilter = loadEvent.filter;
    this.getAvailableImages(loadEvent.pagination, true, loadEvent.filter);
  }

  kypoImagesToggled(): void {
    this.kypoImages = !this.kypoImages;
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
    this.paginationService.setPagination(loadEvent.pagination.size);
    this.getAvailableImages(loadEvent.pagination, false);
  }

  private getAvailableImages(pagination: PaginationBaseEvent, cached: boolean, filter?: string): void {
    this.vmImagesService
      .getAvailableImages(pagination, this.kypoImages, this.guiAccess, cached, filter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private getInitialPaginationEvent(): OffsetPaginationEvent {
    return new OffsetPaginationEvent(
      0,
      this.paginationService.getPagination(),
      this.INIT_SORT_NAME,
      this.INIT_SORT_DIR
    );
  }
}
