import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CsirtMuConfirmationDialogComponent,
  CsirtMuConfirmationDialogConfig,
  CsirtMuDialogResultEnum,
} from 'csirt-mu-common';
import { KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { PoolApi, SandboxInstanceApi } from 'kypo-sandbox-api';
import { Pool } from 'kypo-sandbox-model';
import { EMPTY, from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler } from '../client/sandbox-error.handler';
import { SandboxNavigator } from '../client/sandbox-navigator.service';
import { SandboxNotificationService } from '../client/sandbox-notification.service';
import { SandboxAgendaContext } from '../internal/sandox-agenda-context.service';
import { PoolOverviewService } from './pool-overview.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get pools and perform various operations to modify them.
 */
@Injectable()
export class PoolOverviewConcreteService extends PoolOverviewService {
  private lastPagination: KypoRequestedPagination;

  constructor(
    private poolApi: PoolApi,
    private dialog: MatDialog,
    private sandboxApi: SandboxInstanceApi,
    private context: SandboxAgendaContext,
    private router: Router,
    private navigator: SandboxNavigator,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.defaultPaginationSize);
  }

  /**
   * Gets all pools with passed pagination and updates related observables or handles an error
   * @param pagination requested pagination
   */
  getAll(pagination: KypoRequestedPagination): Observable<KypoPaginatedResource<Pool>> {
    this.lastPagination = pagination;
    this.hasErrorSubject$.next(false);
    return this.poolApi.getPools(pagination).pipe(
      tap(
        (paginatedPools) => {
          this.resourceSubject$.next(paginatedPools);
        },
        (err) => {
          this.errorHandler.emit(err, 'Fetching pools');
          this.hasErrorSubject$.next(true);
        }
      )
    );
  }

  /**
   * Starts a sandbox instance allocation, inforoms about the result and updates list of pools or handles an error
   * @param pool a pool to be allocated with sandbox instances
   * @param count number of sandbox instances to be allocated
   */
  allocate(pool: Pool, count: number = -1): Observable<any> {
    let allocation$: Observable<any>;
    if (count <= 0) {
      allocation$ = this.sandboxApi.allocateSandboxes(pool.id);
    } else {
      allocation$ = this.sandboxApi.allocateSandboxes(pool.id, count);
    }
    return allocation$.pipe(
      tap(
        (_) => this.notificationService.emit('success', `Allocation of pool ${pool.id} started`),
        (err) => this.errorHandler.emit(err, `Allocation of pool ${pool.id}`)
      ),
      switchMap((_) => this.getAll(this.lastPagination))
    );
  }

  /**
   * Deletes a pool, informs about the result and updates list of pools or handles an error
   * @param pool a pool to be deleted
   */
  delete(pool: Pool): Observable<any> {
    return this.displayConfirmationDialog(pool, 'Delete').pipe(
      switchMap((result) => (result === CsirtMuDialogResultEnum.CONFIRMED ? this.callApiToDelete(pool) : EMPTY))
    );
  }

  /**
   * Clears a pool by deleting all associated sandbox instances, informs about the result and updates list of pools or handles an error
   * @param pool a pool to be cleared
   */
  clear(pool: Pool): Observable<any> {
    return this.displayConfirmationDialog(pool, 'Clear').pipe(
      switchMap((result) => (result === CsirtMuDialogResultEnum.CONFIRMED ? this.callApiToClear(pool) : EMPTY))
    );
  }

  create(): Observable<any> {
    return from(this.router.navigate([this.navigator.toCreatePool()]));
  }

  lock(pool: Pool): Observable<any> {
    return this.poolApi.lockPool(pool.id).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Pool ${pool.id} was locked`),
        (err) => this.errorHandler.emit(err, `Locking pool ${pool.id}`)
      ),
      switchMap((_) => this.getAll(this.lastPagination))
    );
  }

  unlock(pool: Pool): Observable<any> {
    return this.displayConfirmationDialog(pool, 'Unlock').pipe(
      switchMap((result) => (result === CsirtMuDialogResultEnum.CONFIRMED ? this.callApiToUnlock(pool) : EMPTY))
    );
  }

  private displayConfirmationDialog(pool: Pool, action: string): Observable<CsirtMuDialogResultEnum> {
    const dialogRef = this.dialog.open(CsirtMuConfirmationDialogComponent, {
      data: new CsirtMuConfirmationDialogConfig(
        `${action} Pool`,
        `Do you want to ${action} pool "${pool.id}"?`,
        'Cancel',
        action
      ),
    });
    return dialogRef.afterClosed();
  }

  private callApiToDelete(pool: Pool): Observable<any> {
    return this.poolApi.deletePool(pool.id).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Pool ${pool.id} was deleted`),
        (err) => this.errorHandler.emit(err, `Deleting pool ${pool.id}`)
      ),
      switchMap((_) => this.getAll(this.lastPagination))
    );
  }

  private callApiToClear(pool: Pool): Observable<any> {
    return this.poolApi.clearPool(pool.id).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Pool ${pool.id} was cleared`),
        (err) => this.errorHandler.emit(err, `Clearing pool ${pool.id}`)
      ),
      switchMap((_) => this.getAll(this.lastPagination))
    );
  }

  private callApiToUnlock(pool: Pool): Observable<any> {
    return this.poolApi.unlockPool(pool.id, pool.lockId).pipe(
      tap(
        (_) => this.notificationService.emit('success', `Pool ${pool.id} was unlocked`),
        (err) => this.errorHandler.emit(err, `Unlocking pool ${pool.id}`)
      ),
      switchMap((_) => this.getAll(this.lastPagination))
    );
  }
}
