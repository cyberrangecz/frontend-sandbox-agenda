import { PaginatedResource, RequestedPagination } from '@sentinel/common';

export class StageDetailAdditionalInfo {
  resourceName: string;
  content: PaginatedResource<string>;
  hasError: boolean;
  requestedPagination: RequestedPagination;

  constructor(
    resourceName: string,
    content: PaginatedResource<string>,
    requestedPagination: RequestedPagination,
    hasError: boolean = false
  ) {
    this.resourceName = resourceName;
    this.content = content;
    this.requestedPagination = requestedPagination;
    this.hasError = hasError;
  }
}
