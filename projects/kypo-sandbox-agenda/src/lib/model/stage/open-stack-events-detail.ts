import { PaginatedResource, RequestedPagination } from '@sentinel/common';
import { OpenStackEvent } from 'kypo-sandbox-model';
import { StageDetailAdditionalInfo } from './stage-detail-additional-info';

/**
 * @dynamic
 */
export class OpenStackEventsDetail extends StageDetailAdditionalInfo {
  constructor(
    content: PaginatedResource<OpenStackEvent>,
    requestedPagination: RequestedPagination,
    hasError: boolean = false
  ) {
    const formattedEvents = content ? OpenStackEventsDetail.eventsToString(content.elements) : [];
    const formattedContent = content ? new PaginatedResource(formattedEvents, content.pagination) : undefined;
    super('OpenStack Events', formattedContent, requestedPagination, hasError);
  }

  private static eventsToString(events: OpenStackEvent[]): string[] {
    return events.map((ev) => `${ev.time} ${ev.name} ${ev.status} ${ev.statusReason}`);
  }
}
