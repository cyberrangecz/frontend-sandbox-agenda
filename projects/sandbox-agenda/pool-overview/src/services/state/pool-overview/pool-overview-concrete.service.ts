import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    SentinelConfirmationDialogComponent,
    SentinelConfirmationDialogConfig,
    SentinelDialogResultEnum,
} from '@sentinel/components/dialogs';
import { OffsetPaginationEvent, PaginatedResource } from '@sentinel/common/pagination';
import { PoolApi } from '@crczp/sandbox-api';
import { Pool } from '@crczp/sandbox-model';
import { EMPTY, from, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { SandboxErrorHandler, SandboxNavigator, SandboxNotificationService } from '@crczp/sandbox-agenda';
import { SandboxAgendaContext } from '@crczp/sandbox-agenda/internal';
import { PoolOverviewService } from './pool-overview.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get pools and perform various operations to modify them.
 */
@Injectable()
export class PoolOverviewConcreteService extends PoolOverviewService {
    private lastPagination: OffsetPaginationEvent;

    constructor(
        context: SandboxAgendaContext,
        private poolApi: PoolApi,
        private dialog: MatDialog,
        private router: Router,
        private navigator: SandboxNavigator,
        private notificationService: SandboxNotificationService,
        private errorHandler: SandboxErrorHandler,
    ) {
        super(context.config.defaultPaginationSize);
    }

    /**
     * Gets all pools with passed pagination and updates related observables or handles an error
     * @param pagination requested pagination
     */
    getAll(pagination: OffsetPaginationEvent): Observable<PaginatedResource<Pool>> {
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
                },
            ),
        );
    }

    /**
     * Starts a sandbox instance allocation, informs about the result and updates list of pools or handles an error
     * @param pool a pool to be allocated with sandbox instances
     * @param count number of sandbox instances to be allocated
     */
    allocate(pool: Pool, count = -1): Observable<any> {
        let allocation$: Observable<any>;
        if (count <= 0) {
            allocation$ = this.poolApi.allocateSandboxes(pool.id);
        } else {
            allocation$ = this.poolApi.allocateSandboxes(pool.id, count);
        }
        return allocation$.pipe(
            tap(
                () => this.notificationService.emit('success', `Allocation of pool ${pool.id} started`),
                (err) => this.errorHandler.emit(err, `Allocation of pool ${pool.id}`),
            ),
        );
    }

    /**
     * Deletes a pool, informs about the result and updates list of pools or handles an error
     * @param pool a pool to be deleted
     */
    delete(pool: Pool): Observable<any> {
        const forceDelete = pool.usedSize !== 0;
        return this.displayDeleteDialog(pool, forceDelete).pipe(
            switchMap((result) =>
                result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToDelete(pool, forceDelete) : EMPTY,
            ),
        );
    }

    /**
     * Clears a pool by deleting all associated sandbox instances, informs about the result and updates list of pools or handles an error
     * @param pool a pool to be cleared
     */
    clear(pool: Pool): Observable<any> {
        return this.displayConfirmationDialog(pool, 'Clear').pipe(
            switchMap((result) =>
                result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToClear(pool.id) : EMPTY,
            ),
        );
    }

    create(): Observable<any> {
        return from(this.router.navigate([this.navigator.toCreatePool()]));
    }

    update(pool: Pool): Observable<any> {
        return from(this.router.navigate([this.navigator.toUpdatePool(pool.id)]));
    }

    lock(pool: Pool): Observable<any> {
        return this.poolApi.lockPool(pool.id, null).pipe(
            tap(
                () => this.notificationService.emit('success', `Pool ${pool.id} was locked`),
                (err) => this.errorHandler.emit(err, `Locking pool ${pool.id}`),
            ),
        );
    }

    getSshAccess(poolId: number): Observable<boolean> {
        return this.poolApi.getManagementSshAccess(poolId).pipe(
            catchError((err) => {
                this.errorHandler.emit(err, `Management SSH Access for pool: ${poolId}`);
                return EMPTY;
            }),
        );
    }

    unlock(pool: Pool): Observable<any> {
        return this.displayConfirmationDialog(pool, 'Unlock').pipe(
            switchMap((result) => (result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToUnlock(pool) : EMPTY)),
        );
    }

    private displayConfirmationDialog(pool: Pool, action: string): Observable<SentinelDialogResultEnum> {
        const dialogRef = this.dialog.open(SentinelConfirmationDialogComponent, {
            data: new SentinelConfirmationDialogConfig(
                `${action} Pool`,
                `Do you want to ${action.toLowerCase()} pool "${pool.id}"?`,
                'Cancel',
                action,
            ),
        });
        return dialogRef.afterClosed();
    }

    private displayDeleteDialog(pool: Pool, force: boolean): Observable<SentinelDialogResultEnum> {
        const action = force ? 'Delete with allocations' : 'Delete';
        let message = `Do you want to delete pool "${pool.id}"`;
        message += force ? ' with all its allocations?' : '?';
        const dialogRef = this.dialog.open(SentinelConfirmationDialogComponent, {
            data: new SentinelConfirmationDialogConfig(`Delete Pool`, message, 'Cancel', action),
        });
        return dialogRef.afterClosed();
    }

    private callApiToDelete(pool: Pool, forceDelete: boolean): Observable<any> {
        return this.poolApi.deletePool(pool.id, forceDelete).pipe(
            tap(
                () => this.notificationService.emit('success', `Pool ${pool.id} was deleted`),
                (err) => this.errorHandler.emit(err, `Deleting pool ${pool.id}`),
            ),
        );
    }

    private callApiToClear(poolId: number): any {
        return this.poolApi.createMultipleCleanupRequests(poolId, true).pipe(
            tap(
                () => this.notificationService.emit('success', `Pool ${poolId} has been cleared`),
                (err) => this.errorHandler.emit(err, 'Clearing pool ' + poolId.toString()),
            ),
            switchMap(() => this.getAll(this.lastPagination)),
        );
    }

    private callApiToUnlock(pool: Pool): Observable<any> {
        return this.poolApi.unlockPool(pool.id, pool.lockId).pipe(
            tap(
                () => this.notificationService.emit('success', `Pool ${pool.id} was unlocked`),
                (err) => this.errorHandler.emit(err, `Unlocking pool ${pool.id}`),
            ),
        );
    }

    updateComment(pool: Pool): Observable<any> {
        return this.poolApi.updatePool(pool).pipe(
            tap(
                () => this.notificationService.emit('success', `Pool comment for ${pool.id} was updated`),
                (err) => this.errorHandler.emit(err, 'Editing pool comment'),
            ),
        );
    }
}
