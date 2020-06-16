import { KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { OpenstackResource } from 'kypo-sandbox-model';
import { StageDetailAdditionalInfo } from './stage-detail-additional-info';

export class OpenstackResourcesDetail extends StageDetailAdditionalInfo {
  constructor(
    content: KypoPaginatedResource<OpenstackResource>,
    requestedPagination: KypoRequestedPagination,
    hasError: boolean = false
  ) {
    const formattedResources = content ? OpenstackResourcesDetail.resourcesToStringToString(content.elements) : [];
    const formattedContent = content ? new KypoPaginatedResource(formattedResources, content.pagination) : undefined;
    super('Openstack Resources', formattedContent, requestedPagination, hasError);
  }

  private static resourcesToStringToString(resources: OpenstackResource[]): string[] {
    return resources.map((resource) => `${resource.name} ${resource.type} ${resource.status}`);
  }
}
