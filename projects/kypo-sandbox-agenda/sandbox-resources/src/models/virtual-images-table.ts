import { VMImagesRowAdapter } from './vm-images-row-adapter';
import { Column, Row, SentinelTable, RowExpand } from '@sentinel/components/table';
import { PaginatedResource } from '@sentinel/common';
import { VirtualImage } from 'kypo-sandbox-model';
import { VMImageDetailComponent } from '../components/vm-image-detail/vm-image-detail.component';
import { formatDate } from '@angular/common';

export class VirtualImagesTable extends SentinelTable<VMImagesRowAdapter> {
  constructor(resource: PaginatedResource<VirtualImage>) {
    const rows = resource.elements.map((element) => VirtualImagesTable.createRow(element));
    const columns = [
      new Column('name', 'name', true, 'name'),
      new Column('defaultUser', 'default user', false),
      new Column('updatedAtFormatted', 'updated at', false),
      new Column('minDisk', 'min disk', false),
      new Column('minRam', 'min ram', false),
      new Column('status', 'status', false),
      new Column('visibility', 'visibility', false),
    ];
    super(rows, columns);
    this.pagination = resource.pagination;
    this.expand = new RowExpand(VMImageDetailComponent);
  }

  private static createRow(image: VirtualImage): Row<VMImagesRowAdapter> {
    const rowAdapter = image as VMImagesRowAdapter;
    rowAdapter.updatedAtFormatted = formatDate(rowAdapter.updatedAt, 'd MMM yyyy H:mm', 'en-US');
    rowAdapter.createdAtFormatted = formatDate(rowAdapter.createdAt, 'd MMM yyyy H:mm', 'en-US');
    return new Row<VMImagesRowAdapter>(rowAdapter);
  }
}
