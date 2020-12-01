import { SandboxAgendaContext } from '@kypo/sandbox-agenda/internal';
import { takeWhile, map } from 'rxjs/operators';
import { Resources, VirtualImage } from '@kypo/sandbox-model';
import { SentinelBaseDirective, RequestedPagination } from '@sentinel/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { SandboxResourcesService } from '../services/sandbox-resources.service';
import { SentinelTable, LoadTableEvent } from '@sentinel/components/table';
import { VMImagesService } from '../services/vm-images.service';
import { VirtualImagesTable } from '../models/virtual-images-table';

@Component({
  selector: 'kypo-resources-page',
  templateUrl: './resources-page.component.html',
  styleUrls: ['./resources-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesPageComponent extends SentinelBaseDirective implements OnInit {
  readonly INIT_SORT_NAME = 'name';
  readonly INIT_SORT_DIR = 'asc';

  images$: Observable<SentinelTable<VirtualImage>>;
  imagesTableHasError$: Observable<boolean>;

  resources$: Observable<Resources>;

  constructor(
    private sandboxResourcesService: SandboxResourcesService,
    private vmImagesService: VMImagesService,
    private context: SandboxAgendaContext
  ) {
    super();
    this.resources$ = this.sandboxResourcesService.resources$;
  }

  ngOnInit(): void {
    this.sandboxResourcesService
      .getResources()
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
    this.initTable();
  }

  onLoadTableEvent(loadEvent: LoadTableEvent) {
    this.vmImagesService
      .getAvailableImages(loadEvent.pagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  private initTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, this.context.config.defaultPaginationSize, this.INIT_SORT_NAME, this.INIT_SORT_DIR)
    );

    this.images$ = this.vmImagesService.resource$.pipe(map((resource) => new VirtualImagesTable(resource)));
    this.imagesTableHasError$ = this.vmImagesService.hasError$;
    this.onLoadTableEvent(initialLoadEvent);
  }
}
