import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  SentinelConfirmationDialogComponent,
  SentinelConfirmationDialogConfig,
  SentinelDialogResultEnum,
} from '@sentinel/components/dialogs';
import { OffsetPaginationEvent, PaginatedResource } from '@sentinel/common';
import { SandboxDefinitionApi } from '@muni-kypo-crp/sandbox-api';
import { SandboxDefinition, SandboxInstance } from '@muni-kypo-crp/sandbox-model';
import { EMPTY, from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxNotificationService, SandboxNavigator, SandboxErrorHandler } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '../sandox-agenda-context.service';
import { SandboxDefinitionOverviewService } from './sandbox-definition-overview.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get sandbox definitions and perform various operations to modify them.
 */
@Injectable()
export class SandboxDefinitionOverviewConcreteService extends SandboxDefinitionOverviewService {
  constructor(
    private api: SandboxDefinitionApi,
    private router: Router,
    private dialog: MatDialog,
    private alertService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler,
    private context: SandboxAgendaContext,
    private navigator: SandboxNavigator
  ) {
    super(context.config.defaultPaginationSize);
  }

  private lastPagination: OffsetPaginationEvent;

  /**
   * Gets all sandbox definitions with passed pagination and updates related observables or handles an error
   * @param pagination requested pagination
   */
  getAll(pagination: OffsetPaginationEvent): Observable<PaginatedResource<SandboxDefinition>> {
    this.hasErrorSubject$.next(false);
    this.lastPagination = pagination;
    return this.api.getAll(pagination).pipe(
      tap(
        (paginatedResource) => {
          this.resourceSubject$.next(paginatedResource);
        },
        (err) => {
          this.errorHandler.emit(err, 'Fetching sandbox definitions');
          this.hasErrorSubject$.next(true);
        }
      )
    );
  }

  create(): Observable<any> {
    return of(this.router.navigate([this.navigator.toNewSandboxDefinition()]));
  }

  /**
   * Deletes a sandbox definition, informs about the result and updates list of sandbox definitions or handles an error
   * @param sandboxDefinition sandbox definition to be deleted
   */
  delete(sandboxDefinition: SandboxDefinition): Observable<PaginatedResource<SandboxDefinition>> {
    return this.displayDialogToDelete(sandboxDefinition).pipe(
      switchMap((result) =>
        result === SentinelDialogResultEnum.CONFIRMED ? this.callApiToDelete(sandboxDefinition) : EMPTY
      )
    );
  }

  private displayDialogToDelete(sandboxDefinition: SandboxDefinition): Observable<SentinelDialogResultEnum> {
    const dialogRef = this.dialog.open(SentinelConfirmationDialogComponent, {
      data: new SentinelConfirmationDialogConfig(
        'Delete Sandbox Definition',
        `Do you want to delete sandbox definition "${sandboxDefinition.title}"?`,
        'Cancel',
        'Delete'
      ),
    });
    return dialogRef.afterClosed();
  }

  private callApiToDelete(sandboxDefinition: SandboxDefinition): Observable<PaginatedResource<SandboxDefinition>> {
    return this.api.delete(sandboxDefinition.id).pipe(
      tap(
        () => this.alertService.emit('success', 'Sandbox definition was successfully deleted'),
        (err) => this.errorHandler.emit(err, 'Removing sandbox definition')
      ),
      switchMap(() => this.getAll(this.lastPagination))
    );
  }

  showTopology(sandboxDefinition: SandboxDefinition): Observable<any> {
    return from(this.router.navigate([this.navigator.toSandboxDefinitionTopology(sandboxDefinition.id)]));
  }
}
