import { VMImagesRowAdapter } from './../../models/vm-images-row-adapter';
import { Component, Input, HostBinding } from '@angular/core';

/**
 * Example of expanded row component
 */
@Component({
  selector: 'kypo-vm-image-detail',
  templateUrl: './vm-image-detail.component.html',
  styleUrls: ['./vm-image-detail.component.css'],
})
export class VMImageDetailComponent {
  @HostBinding('style.width') width = '100%';
  @Input() data: VMImagesRowAdapter;
}
