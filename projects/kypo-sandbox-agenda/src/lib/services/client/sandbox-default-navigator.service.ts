import { Injectable } from '@angular/core';
import {
  POOL_ALLOCATION_REQUEST_PATH,
  POOL_CLEANUP_REQUEST_PATH,
  SANDBOX_DEFINITION_NEW_PATH,
  SANDBOX_DEFINITION_PATH,
  SANDBOX_INSTANCE_PATH,
  SANDBOX_INSTANCE_TOPOLOGY_PATH,
  SANDBOX_POOL_NEW_PATH,
  SANDBOX_POOL_PATH,
} from '../../model/client/default-paths';
import { SandboxNavigator } from './sandbox-navigator.service';

@Injectable()
export class SandboxDefaultNavigator extends SandboxNavigator {
  /**
   * Returns route to sandbox definition page
   */
  toSandboxDefinitionOverview(): string {
    return SANDBOX_DEFINITION_PATH;
  }

  /**
   * Returns route to new sandbox definition page
   */
  toNewSandboxDefinition(): string {
    return `${SANDBOX_DEFINITION_PATH}/${SANDBOX_DEFINITION_NEW_PATH}`;
  }

  /**
   * Returns route to pool detail page
   * @param id id of the pool
   */
  toPool(id: number | string): string {
    return `${SANDBOX_POOL_PATH}/${id}`;
  }

  /**
   * Returns route to pool overview page
   */
  toPoolOverview(): string {
    return SANDBOX_POOL_PATH;
  }

  toCreatePool(): string {
    return `${SANDBOX_POOL_PATH}/${SANDBOX_POOL_NEW_PATH}`;
  }

  /**
   * Returns route to sandbox instance topology page
   * @param poolId id of the pool associated with the sandbox instance
   * @param sandboxId id of the sandbox
   */
  toSandboxInstanceTopology(poolId: number | string, sandboxId: number | string): string {
    return `${SANDBOX_POOL_PATH}/${poolId}/${SANDBOX_INSTANCE_PATH}/${sandboxId}/${SANDBOX_INSTANCE_TOPOLOGY_PATH}`;
  }

  /**
   * Returns route to creation request detail page
   * @param poolId id of the pool associated with the request
   * @param requestId id of the request
   */
  toAllocationRequest(poolId: number | string, requestId: number | string): string {
    return `${SANDBOX_POOL_PATH}/${poolId}/${POOL_ALLOCATION_REQUEST_PATH}/${requestId}`;
  }

  /**
   * Returns route to cleanup request detail page
   * @param poolId id of the pool associated with the request
   * @param requestId id of the request
   */
  toCleanupRequest(poolId: number | string, requestId: number | string): string {
    return `${SANDBOX_POOL_PATH}/${poolId}/${POOL_CLEANUP_REQUEST_PATH}/${requestId}`;
  }
}
