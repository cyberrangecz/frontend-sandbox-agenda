import { VMImagesRowAdapter } from './vm-images-row-adapter';
import { Column, Row, SentinelTable, RowExpand } from '@sentinel/components/table';
import { PaginatedResource } from '@sentinel/common';
import { VirtualImage } from '@muni-kypo-crp/sandbox-model';
import { VMImageDetailComponent } from '../components/vm-image-detail/vm-image-detail.component';
import { formatDate } from '@angular/common';

export class VirtualImagesTable extends SentinelTable<VMImagesRowAdapter> {
  constructor(resource: PaginatedResource<VirtualImage>) {
    const rows = resource.elements.map((element) => VirtualImagesTable.createRow(element));
    const columns = [
      new Column('name', 'name', true, 'name'),
      new Column('defaultUser', 'default user', true, 'defaultUser'),
      new Column('updatedAtFormatted', 'updated at', true, 'updated_at'),
      new Column('guiAccessFormatted', 'GUI access', false),
      new Column('sizeFormatted', 'size (GB)', false),
    ];
    super(rows, columns);
    this.pagination = resource.pagination;
    this.expand = new RowExpand(VMImageDetailComponent);
    this.filterable = true;
    this.filterLabel = 'Filter by name';
  }

  private static createRow(image: VirtualImage): Row<VMImagesRowAdapter> {
    const rowAdapter = image as VMImagesRowAdapter;
    rowAdapter.updatedAtFormatted = formatDate(rowAdapter.updatedAt, 'd MMM yyyy H:mm', 'en-US');
    rowAdapter.createdAtFormatted = formatDate(rowAdapter.createdAt, 'd MMM yyyy H:mm', 'en-US');
    rowAdapter.guiAccessFormatted = image.ownerSpecified.guiAccess ? 'Yes' : 'No';
    rowAdapter.sizeFormatted = Math.round(image.size * 10) / 10;
    return new Row<VMImagesRowAdapter>(rowAdapter);
  }
}
