import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PoolApi } from '@crczp/sandbox-api';
import { Pool, SandboxDefinition } from '@crczp/sandbox-model';
import { BehaviorSubject, from, Observable, ReplaySubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxDefinitionSelectComponent } from '../components/sandbox-definition-select/sandbox-definition-select.component';
import { SandboxErrorHandler, SandboxNavigator, SandboxNotificationService } from '@crczp/sandbox-agenda';
import { PoolEditService } from './pool-edit.service';
import { PoolChangedEvent } from '../model/pool-changed-event';

@Injectable()
export class PoolEditConcreteService extends PoolEditService {
    constructor(
        private router: Router,
        private dialog: MatDialog,
        private navigator: SandboxNavigator,
        private notificationService: SandboxNotificationService,
        private errorHandler: SandboxErrorHandler,
        private api: PoolApi,
    ) {
        super();
    }

    private editModeSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    /**
     * True if existing pool is edited, false if new one is created
     */
    editMode$: Observable<boolean> = this.editModeSubject$.asObservable();

    private poolSubject$: ReplaySubject<Pool> = new ReplaySubject();

    private saveDisabledSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    /**
     * True if saving is disabled (for example invalid data), false otherwise
     */
    saveDisabled$: Observable<boolean> = this.saveDisabledSubject$.asObservable();

    private editedPool: Pool;

    create(): Observable<any> {
        return this.api.createPool(this.editedPool).pipe(
            tap(
                () => this.notificationService.emit('success', 'Pool was created'),
                (err) => this.errorHandler.emit(err, 'Creating pool'),
            ),
            switchMap(() => from(this.router.navigate([this.navigator.toPoolOverview()]))),
        );
    }

    /**
     * Handles pool state changes. Updates internal state and emits observables
     * @param changeEvent edited group-overview change event
     */
    change(changeEvent: PoolChangedEvent): void {
        this.saveDisabledSubject$.next(!changeEvent.isValid);
        this.editedPool = changeEvent.pool;
    }

    /**
     * Updates pool with new data
     */
    update(): Observable<any> {
        return this.api.updatePool(this.editedPool).pipe(
            tap(
                () => {
                    this.notificationService.emit('success', 'Pool was updated');
                    this.onSaved();
                },
                (err) => this.errorHandler.emit(err, 'Editing pool'),
            ),
        );
    }

    selectDefinition(currSelected: SandboxDefinition): Observable<SandboxDefinition> {
        const dialogRef = this.dialog.open(SandboxDefinitionSelectComponent, { data: currSelected });
        return dialogRef.afterClosed();
    }

    /**
     * Saves/creates edited pool
     */
    save(): Observable<any> {
        return this.editModeSubject$.getValue()
            ? this.update().pipe(tap(() => this.router.navigate([this.navigator.toPoolOverview()])))
            : this.create().pipe(tap(() => this.router.navigate([this.navigator.toPoolOverview()])));
    }

    /**
     * Sets pool to state
     * @param initialPool pool to state
     */
    set(initialPool: Pool): void {
        let pool = initialPool;
        this.setEditMode(pool);
        if (pool === null || pool === undefined) {
            pool = new Pool();
        }
        this.poolSubject$.next(pool);
    }

    private setEditMode(pool: Pool) {
        this.editModeSubject$.next(pool !== null && pool !== undefined);
    }

    private onSaved() {
        this.editModeSubject$.next(true);
        this.saveDisabledSubject$.next(true);
        this.poolSubject$.next(this.editedPool);
        this.editedPool = null;
    }
}
