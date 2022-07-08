import { MetadataOverride } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OffsetPaginationEvent } from '@sentinel/common';
import {
  AllocationRequestsApi,
  CleanupRequestsApi,
  PoolApi,
  ResourcesApi,
  SandboxAllocationUnitsApi,
  SandboxDefinitionApi,
  SandboxInstanceApi,
  VMImagesApi,
} from '@muni-kypo-crp/sandbox-api';
import { KypoTopologyGraphConfig } from '@muni-kypo-crp/topology-graph';
import { SandboxAgendaConfig } from '../../../src/sandbox-agenda-config';
import { SandboxErrorHandler } from '../../../src/sandbox-error-handler.service';
import { SandboxNavigator } from '../../../src/sandbox-navigator.service';
import { SandboxNotificationService } from '../../../src/sandbox-notification.service';
import { SandboxAgendaContext } from '../services/sandox-agenda-context.service';

export const SENTINEL_TABLE_COMPONENT_SELECTOR = 'sentinel-table';
export const SENTINEL_CONTROLS_COMPONENT_SELECTOR = 'sentinel-controls';
export const SENTINEL_RESOURCE_SELECTOR_COMPONENT_SELECTOR = 'sentinel-resource-selector';

export function createDefinitionApiSpy(): jasmine.SpyObj<SandboxDefinitionApi> {
  return jasmine.createSpyObj('SandboxDefinitionApi', ['getAll', 'delete', 'add', 'create']);
}

export function createPoolApiSpy(): jasmine.SpyObj<PoolApi> {
  return jasmine.createSpyObj('PoolApi', [
    'getAllocationRequests',
    'getCleanupRequests',
    'getPoolsSandboxAllocationUnits',
    'createPool',
    'allocateSandboxes',
    'getManagementSshAccess',
    'getPools',
  ]);
}

export function createSauApiSpy(): jasmine.SpyObj<SandboxAllocationUnitsApi> {
  return jasmine.createSpyObj(['createCleanupRequest', 'deleteCleanupRequest']);
}

export function createSiApiSpy(): jasmine.SpyObj<SandboxInstanceApi> {
  return jasmine.createSpyObj(['getSandboxes']);
}

export function createAllocationRequestApiSpy(): jasmine.SpyObj<AllocationRequestsApi> {
  return jasmine.createSpyObj('AllocationRequestsApi', ['cancel']);
}

export function createCleanupRequestApiSpy(): jasmine.SpyObj<CleanupRequestsApi> {
  return jasmine.createSpyObj('CleanupRequestsApi', ['cancel']);
}

export function createResourcesApiSpy(): jasmine.SpyObj<ResourcesApi> {
  return jasmine.createSpyObj(['getResources']);
}

export function createVMImagesApiSpy(): jasmine.SpyObj<VMImagesApi> {
  return jasmine.createSpyObj(['getAvailableImages']);
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
  config.kypoTopologyConfig = new KypoTopologyGraphConfig();
  return new SandboxAgendaContext(config);
}

export function createNavigatorSpy(): jasmine.SpyObj<SandboxNavigator> {
  return jasmine.createSpyObj('SandboxNavigator', [
    'toNewSandboxDefinition',
    'toPoolOverview',
    'toSandboxDefinitionOverview',
  ]);
}

export function createErrorHandlerSpy(): jasmine.SpyObj<SandboxErrorHandler> {
  return jasmine.createSpyObj('SandboxErrorHandler', ['emit']);
}

export function createPagination(): OffsetPaginationEvent {
  return new OffsetPaginationEvent(0, 5, '', '');
}

export function createSentinelTableOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: SENTINEL_TABLE_COMPONENT_SELECTOR,
      inputs: ['hasError', 'defaultSortName', 'defaultSortDirection', 'data'],
      outputs: ['refresh', 'rowAction', 'rowSelection'],
    },
  };
}

export function createResourceSelectorOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: SENTINEL_RESOURCE_SELECTOR_COMPONENT_SELECTOR,
      inputs: ['searchPlaceholder', 'resources', 'selected', 'resourceMapping'],
      outputs: ['selectionChange', 'fetch'],
    },
  };
}

export function createSentinelControlsOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: SENTINEL_CONTROLS_COMPONENT_SELECTOR,
      outputs: ['itemClicked'],
    },
  };
}
