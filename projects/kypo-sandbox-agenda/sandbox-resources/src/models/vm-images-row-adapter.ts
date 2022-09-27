import { VirtualImage } from '@muni-kypo-crp/sandbox-model';

export class VMImagesRowAdapter extends VirtualImage {
  updatedAtFormatted: string;
  createdAtFormatted: string;
  guiAccessFormatted: string;
  sizeFormatted: number;
}
