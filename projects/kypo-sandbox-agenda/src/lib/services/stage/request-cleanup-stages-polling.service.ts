import {RequestStagesPollingService} from './request-stages-polling.service';
import {Request} from 'kypo-sandbox-model';
import {Observable} from 'rxjs';
import {KypoPaginatedResource, KypoRequestedPagination} from 'kypo-common';
import {RequestStage} from 'kypo-sandbox-model';
import {take, tap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StagesApi} from 'kypo-sandbox-api';
import {SandboxNotificationService} from '../client/sandbox-notification.service';
import {SandboxErrorHandler} from '../client/sandbox-error.handler';
import {SandboxNavigator} from '../client/sandbox-navigator.service';
import {SandboxAgendaContext} from '../internal/sandox-agenda-context.service';

@Injectable()
export class RequestCleanupStagesPollingService extends RequestStagesPollingService {

  constructor(private api: StagesApi,
              private router: Router,
              private route: ActivatedRoute,
              private navigator: SandboxNavigator,
              private context: SandboxAgendaContext,
              private notificationService: SandboxNotificationService,
              private errorHandler: SandboxErrorHandler) {
    super(context.config.defaultPaginationSize, context.config.pollingPeriod);
  }

  /**
   * Gets all stages and updates related observables or handles an error
   * @param request request associated with stages
   */
  getAll(request: Request): Observable<KypoPaginatedResource<RequestStage>> {
    this.onManualGetAll(request);
    const fakePagination = new KypoRequestedPagination(0, 100, '', '');
    return this.api.getCleanupStages(request.allocationUnitId, request.id, fakePagination)
      .pipe(
        tap(
          resource =>  {
            this.resourceSubject$.next(resource);
            this.navigateBackIfStagesFinished(resource);
          },
          err => this.onGetAllError(err)
        )
      );
  }

  protected repeatLastGetAllRequest(): Observable<KypoPaginatedResource<RequestStage>> {
    this.hasErrorSubject$.next(false);
    const fakePagination = new KypoRequestedPagination(0, 100, '', '');
    return this.api.getCleanupStages(this.request.allocationUnitId, this.request.id, fakePagination)
      .pipe(
        tap( resource => this.navigateBackIfStagesFinished(resource),
            err => this.onGetAllError(err))
      );
  }

  private onManualGetAll(request: Request) {
    this.request = request;
    if (this.hasErrorSubject$.getValue()) {
      this.retryPolling$.next(true);
    }
    this.hasErrorSubject$.next(false);
  }

  private onGetAllError(err: HttpErrorResponse) {
    if (err.status === 404) {
      this.notificationService.emit('info', 'Cleanup request finished. All stages were removed');
      this.navigateBack();
      return;
    }
    this.errorHandler.emit(err, 'Fetching stages');
    this.hasErrorSubject$.next(true);
  }

  private navigateBackIfStagesFinished(resource: KypoPaginatedResource<RequestStage>) {
    if (resource.elements.every(stage => stage.hasFinished())) {
      this.notificationService.emit('info', 'Cleanup request finished. All stages were removed');
      this.navigateBack();
    }
  }

  private navigateBack() {
    this.route.paramMap
      .pipe(
        take(1)
      ).subscribe(paramMap => this.router.navigate([this.navigator.toPoolOverview()]));
  }
}
