import { MetadataOverride } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KypoRequestedPagination } from 'kypo-common';
import {
  AllocationRequestsApi,
  CleanupRequestsApi,
  PoolApi,
  SandboxAllocationUnitsApi,
  SandboxDefinitionApi,
} from 'kypo-sandbox-api';
import { Kypo2TopologyGraphConfig } from 'kypo2-topology-graph';
import { SandboxAgendaConfig } from '../model/client/sandbox-agenda-config';
import { SandboxErrorHandler } from '../services/client/sandbox-error.handler';
import { SandboxNavigator } from '../services/client/sandbox-navigator.service';
import { SandboxNotificationService } from '../services/client/sandbox-notification.service';
import { SandboxAgendaContext } from '../services/internal/sandox-agenda-context.service';

export const KYPO_TABLE_COMPONENT_SELECTOR = 'kypo2-table';
export const KYPO_CONTROLS_COMPONENT_SELECTOR = 'kypo-controls';
export const KYPO_RESOURCE_SELECTOR_COMPONENT_SELECTOR = 'kypo2-resource-selector';

export function createDefinitionApiSpy(): jasmine.SpyObj<SandboxDefinitionApi> {
  return jasmine.createSpyObj('SandboxDefinitionApi', ['getAll', 'delete', 'add']);
}

export function createPoolApiSpy(): jasmine.SpyObj<PoolApi> {
  return jasmine.createSpyObj('PoolApi', ['getAllocationRequests', 'getCleanupRequests']);
}

export function createSauApiSpy(): jasmine.SpyObj<SandboxAllocationUnitsApi> {
  return jasmine.createSpyObj(['deleteCleanupRequest']);
}

export function createAllocationRequestApiSpy(): jasmine.SpyObj<AllocationRequestsApi> {
  return jasmine.createSpyObj('AllocationRequestsApi', ['cancel']);
}

export function createCleanupRequestApiSpy(): jasmine.SpyObj<CleanupRequestsApi> {
  return jasmine.createSpyObj('CleanupRequestsApi', ['cancel']);
}

export function createRouterSpy(): jasmine.SpyObj<Router> {
  return jasmine.createSpyObj('Router', ['navigate']);
}

export function createNotificationSpy(): jasmine.SpyObj<SandboxNotificationService> {
  return jasmine.createSpyObj('SandboxNotificationService', ['emit']);
}

export function createMatDialogSpy(): jasmine.SpyObj<MatDialog> {
  return jasmine.createSpyObj('MatDialog', ['open']);
}

export function createContextSpy(): jasmine.SpyObj<SandboxAgendaContext> {
  const config = new SandboxAgendaConfig();
  config.pollingPeriod = 5000;
  config.defaultPaginationSize = 20;
  config.kypo2TopologyConfig = new Kypo2TopologyGraphConfig();
  return new SandboxAgendaContext(config);
}

export function createNavigatorSpy(): jasmine.SpyObj<SandboxNavigator> {
  return jasmine.createSpyObj('SandboxNavigator', ['toNewSandboxDefinition']);
}

export function createErrorHandlerSpy(): jasmine.SpyObj<SandboxErrorHandler> {
  return jasmine.createSpyObj('SandboxErrorHandler', ['emit']);
}

export function createPagination(): KypoRequestedPagination {
  return new KypoRequestedPagination(0, 5, '', '');
}

export function createKypoTableOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: KYPO_TABLE_COMPONENT_SELECTOR,
      inputs: ['hasError', 'defaultSortName', 'defaultSortDirection', 'data'],
      outputs: ['refresh', 'rowAction', 'rowSelection'],
    },
  };
}

export function createResourceSelectorOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: KYPO_RESOURCE_SELECTOR_COMPONENT_SELECTOR,
      inputs: ['searchPlaceholder', 'resources', 'selected', 'resourceMapping'],
      outputs: ['selectionChange', 'fetch'],
    },
  };
}

export function createKypoControlsOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: KYPO_CONTROLS_COMPONENT_SELECTOR,
      outputs: ['itemClicked'],
    },
  };
}
