import { PaginatedResource, RequestedPagination } from '@sentinel/common';
import { OpenStackResource } from 'kypo-sandbox-model';
import { StageDetailAdditionalInfo } from './stage-detail-additional-info';

/**
 * @dynamic
 */
export class OpenstackResourcesDetail extends StageDetailAdditionalInfo {
  constructor(
    content: PaginatedResource<OpenStackResource>,
    requestedPagination: RequestedPagination,
    hasError: boolean = false
  ) {
    const formattedResources = content ? OpenstackResourcesDetail.resourcesToStringToString(content.elements) : [];
    const formattedContent = content ? new PaginatedResource(formattedResources, content.pagination) : undefined;
    super('Openstack Resources', formattedContent, requestedPagination, hasError);
  }

  private static resourcesToStringToString(resources: OpenStackResource[]): string[] {
    return resources.map((resource) => `${resource.name} ${resource.type} ${resource.status}`);
  }
}
