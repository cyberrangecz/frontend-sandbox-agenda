import {SandboxDefinitionOverviewService} from './sandbox-definition-overview.service';
import {EMPTY, Observable, of} from 'rxjs';
import {KypoPaginatedResource} from 'kypo-common';
import {KypoRequestedPagination} from 'kypo-common';
import {switchMap, tap} from 'rxjs/operators';
import {SandboxDefinitionApi} from 'kypo-sandbox-api';
import {Injectable} from '@angular/core';
import {SandboxDefinition} from 'kypo-sandbox-model';
import {Router} from '@angular/router';
import {
  CsirtMuConfirmationDialogComponent,
  CsirtMuConfirmationDialogConfig,
  CsirtMuDialogResultEnum
} from 'csirt-mu-common';
import {MatDialog} from '@angular/material/dialog';
import {SandboxNotificationService} from '../client/sandbox-notification.service';
import {SandboxErrorHandler} from '../client/sandbox-error.handler';
import {SandboxNavigator} from '../client/sandbox-navigator.service';
import {SandboxAgendaContext} from '../internal/sandox-agenda-context.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get sandbox definitions and perform various operations to modify them.
 */
@Injectable()
export class SandboxDefinitionOverviewConcreteService extends SandboxDefinitionOverviewService {

  constructor(private api: SandboxDefinitionApi,
              private router: Router,
              private dialog: MatDialog,
              private alertService: SandboxNotificationService,
              private errorHandler: SandboxErrorHandler,
              private context: SandboxAgendaContext,
              private navigator: SandboxNavigator) {
    super(context.config.defaultPaginationSize);
  }

  private lastPagination: KypoRequestedPagination;

  /**
   * Gets all sandbox definitions with passed pagination and updates related observables or handles an error
   * @param pagination requested pagination
   */
  getAll(pagination: KypoRequestedPagination): Observable<KypoPaginatedResource<SandboxDefinition>> {
    this.hasErrorSubject$.next(false);
    this.lastPagination = pagination;
    return this.api.getAll(pagination)
      .pipe(
        tap(paginatedResource => {
          this.resourceSubject$.next(paginatedResource);
          },
            err => {
          this.errorHandler.emit(err, 'Fetching sandbox definitions');
          this.hasErrorSubject$.next(true);
        })
    );
  }

  create(): Observable<any> {
    return of(this.router.navigate([this.navigator.toNewSandboxDefinition()]));
  }

  /**
   * Deletes a sandbox definition, informs about the result and updates list of sandbox definitions or handles an error
   * @param sandboxDefinition sandbox definition to be deleted
   */
  delete(sandboxDefinition: SandboxDefinition): Observable<KypoPaginatedResource<SandboxDefinition>> {
    return this.displayDialogToDelete(sandboxDefinition)
      .pipe(
        switchMap(result => result === CsirtMuDialogResultEnum.CONFIRMED
          ? this.callApiToDelete(sandboxDefinition)
          : EMPTY
        )
      );
  }

  private displayDialogToDelete(sandboxDefinition: SandboxDefinition): Observable<CsirtMuDialogResultEnum> {
    const dialogRef = this.dialog.open(CsirtMuConfirmationDialogComponent, {
      data: new CsirtMuConfirmationDialogConfig(
        'Delete Sandbox Definition',
        `Do you want to delete sandbox definition "${sandboxDefinition.title}"?`,
        'Cancel',
        'Delete'
      )
    });
    return dialogRef.afterClosed();
  }

  private callApiToDelete(sandboxDefinition: SandboxDefinition): Observable<KypoPaginatedResource<SandboxDefinition>> {
    return this.api.delete(sandboxDefinition.id)
      .pipe(
        tap(
          _ => this.alertService.emit('success', 'Sandbox definition was successfully deleted'),
          err => this.errorHandler.emit(err, 'Removing sandbox definition')
        ),
        switchMap(() => this.getAll(this.lastPagination))
      );
  }
}
