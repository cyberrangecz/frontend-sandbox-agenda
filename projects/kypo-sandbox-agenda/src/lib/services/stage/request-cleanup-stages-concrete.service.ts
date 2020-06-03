import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { StagesApi } from 'kypo-sandbox-api';
import { RequestStage } from 'kypo-sandbox-model';
import { Request } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { SandboxErrorHandler } from '../client/sandbox-error.handler';
import { SandboxNavigator } from '../client/sandbox-navigator.service';
import { SandboxNotificationService } from '../client/sandbox-notification.service';
import { SandboxAgendaContext } from '../internal/sandox-agenda-context.service';
import { RequestStagesService } from './request-stages.service';

@Injectable()
export class RequestCleanupStagesConcreteService extends RequestStagesService {
  private lastRequest: Request;

  constructor(
    private api: StagesApi,
    private router: Router,
    private route: ActivatedRoute,
    private navigator: SandboxNavigator,
    private context: SandboxAgendaContext,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.defaultPaginationSize, context.config.pollingPeriod);
  }

  /**
   * Gets all stages and updates related observables or handles an error
   * @param request request associated with stages
   */
  getAll(request: Request): Observable<KypoPaginatedResource<RequestStage>> {
    const fakePagination = new KypoRequestedPagination(0, 100, '', '');
    this.onManualResourceRefresh(fakePagination, this.lastRequest);
    return this.api.getCleanupStages(request.allocationUnitId, request.id, fakePagination).pipe(
      tap(
        (resource) => {
          this.resourceSubject$.next(resource);
          this.navigateBackIfStagesFinished(resource);
        },
        (err) => this.onGetAllError(err)
      )
    );
  }

  protected refreshResource(): Observable<KypoPaginatedResource<RequestStage>> {
    this.hasErrorSubject$.next(false);
    return this.api.getCleanupStages(this.lastRequest.allocationUnitId, this.lastRequest.id, this.lastPagination).pipe(
      tap(
        (resource) => this.navigateBackIfStagesFinished(resource),
        (err) => this.onGetAllError(err)
      )
    );
  }

  protected onManualResourceRefresh(pagination: KypoRequestedPagination, ...params) {
    super.onManualResourceRefresh(pagination, ...params);
    this.lastRequest = params[0];
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
    if (resource.elements.every((stage) => stage.hasFinished())) {
      this.notificationService.emit('info', 'Cleanup request finished. All stages were removed');
      this.navigateBack();
    }
  }

  private navigateBack() {
    this.route.paramMap.pipe(take(1)).subscribe((_) => this.router.navigate([this.navigator.toPoolOverview()]));
  }
}
