import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { RequestedPagination } from '@sentinel/common';
import { SandboxErrorHandler, SandboxNotificationService } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '@muni-kypo-crp/sandbox-agenda/internal';
import { switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AbstractSandboxService } from './abstract-sandbox.service';
import { SandboxAllocationUnitsService } from '../state/sandbox-allocation-unit/sandbox-allocation-units.service';
import { SandboxInstance } from '@muni-kypo-crp/sandbox-model';
import { SandboxInstanceService } from '../state/sandbox-instance/sandbox-instance.service';

@Injectable()
export class AbstractSandboxConcreteService extends AbstractSandboxService {
  private lastPoolId: number;
  private lastPagination: RequestedPagination;

  constructor(
    private sandboxInstanceService: SandboxInstanceService,
    private allocationUnitsService: SandboxAllocationUnitsService,
    private dialog: MatDialog,
    private context: SandboxAgendaContext,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super();
    this.allocationUnits$ = allocationUnitsService.units$;
    this.sandboxInstances$ = sandboxInstanceService.resource$;
  }

  /**
   * Gets all sandbox allocation units for pool with passed pagination and updates related observables or handles an error
   * @param poolId id of a pool associated with requests for sandbox allocation units for pool
   * @param pagination requested pagination
   */
  getAll(poolId: number, pagination: RequestedPagination): Observable<any> {
    this.lastPagination = pagination;
    this.lastPoolId = poolId;
    return combineLatest([
      this.allocationUnitsService.getAll(poolId, pagination),
      this.sandboxInstanceService.getAll(poolId, pagination),
    ]);
  }

  allocate(poolId: number): Observable<any> {
    return this.sandboxInstanceService
      .allocate(poolId)
      .pipe(switchMap(() => this.getAll(this.lastPoolId, this.lastPagination)));
  }

  /**
   * Unlocks a sandbox instance making it available for modification
   * @param sandboxInstance a sandbox instance to be unlocked
   */
  unlock(sandboxInstance: SandboxInstance): Observable<any> {
    return this.sandboxInstanceService.unlock(sandboxInstance);
  }

  /**
   * Lock a sandbox instance making it unavailable for modification and save for usage
   * @param sandboxInstance a sandbox instance to be locked
   */
  lock(sandboxInstance: SandboxInstance): Observable<any> {
    return this.sandboxInstanceService.lock(sandboxInstance);
  }

  /**
   * Gets zip file that contains configurations, key and script for remote ssh access for user
   * @param sandboxId id of the sandbox for which remote ssh access is demanded
   */
  getUserSshAccess(sandboxId: number): Observable<boolean> {
    return this.sandboxInstanceService.getUserSshAccess(sandboxId);
  }

  showTopology(poolId: number, sandboxInstance: SandboxInstance): Observable<any> {
    return this.sandboxInstanceService.showTopology(poolId, sandboxInstance);
  }

  cleanupMultiple(poolId: number, unitIds: number[], force: boolean): Observable<any> {
    return this.allocationUnitsService
      .cleanupMultiple(poolId, unitIds, force)
      .pipe(switchMap(() => this.getAll(this.lastPoolId, this.lastPagination)));
  }
}
