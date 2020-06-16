import { KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { OpenstackEvent } from 'kypo-sandbox-model';
import { StageDetailAdditionalInfo } from './stage-detail-additional-info';

export class OpenstackEventsDetail extends StageDetailAdditionalInfo {
  constructor(
    content: KypoPaginatedResource<OpenstackEvent>,
    requestedPagination: KypoRequestedPagination,
    hasError: boolean = false
  ) {
    const formattedEvents = content ? OpenstackEventsDetail.eventsToString(content.elements) : [];
    const formattedContent = content ? new KypoPaginatedResource(formattedEvents, content.pagination) : undefined;
    super('Openstack Events', formattedContent, requestedPagination, hasError);
  }

  private static eventsToString(events: OpenstackEvent[]): string[] {
    return events.map((ev) => `${ev.time} ${ev.name} ${ev.status} ${ev.statusReason}`);
  }
}
