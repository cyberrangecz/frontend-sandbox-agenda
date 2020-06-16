import { KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';

export class StageDetailAdditionalInfo {
  resourceName: string;
  content: KypoPaginatedResource<string>;
  hasError: boolean;
  requestedPagination: KypoRequestedPagination;

  constructor(
    resourceName: string,
    content: KypoPaginatedResource<string>,
    requestedPagination: KypoRequestedPagination,
    hasError: boolean = false
  ) {
    this.resourceName = resourceName;
    this.content = content;
    this.requestedPagination = requestedPagination;
    this.hasError = hasError;
  }
}
