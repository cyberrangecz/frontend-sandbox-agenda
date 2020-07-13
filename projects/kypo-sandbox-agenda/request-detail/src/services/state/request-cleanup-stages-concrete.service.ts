import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CleanupRequestsApi } from 'kypo-sandbox-api';
import { Request, RequestStage } from 'kypo-sandbox-model';
import { Observable, zip } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { SandboxErrorHandler, SandboxNavigator, SandboxNotificationService } from 'kypo-sandbox-agenda';
import { SandboxAgendaContext } from 'kypo-sandbox-agenda/internal';
import { RequestStagesService } from './request-stages.service';

@Injectable()
export class RequestCleanupStagesConcreteService extends RequestStagesService {
  constructor(
    private api: CleanupRequestsApi,
    private router: Router,
    private route: ActivatedRoute,
    private navigator: SandboxNavigator,
    private context: SandboxAgendaContext,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super(context.config.pollingPeriod);
  }

  protected refreshResource(): Observable<RequestStage[]> {
    return super.refreshResource().pipe(tap((resource) => this.navigateBackIfStagesFinished(resource)));
  }

  protected callApiToGetStages(request: Request): Observable<RequestStage[]> {
    return zip(
      this.api.getOpenStackStage(request.id),
      this.api.getNetworkingAnsibleStage(request.id),
      this.api.getUserAnsibleStage(request.id)
    );
  }

  protected onGetAllError(err: HttpErrorResponse) {
    if (err.status === 404) {
      this.notificationService.emit('info', 'Cleanup request finished. All stages were removed');
      this.navigateBack();
      return;
    }
    this.errorHandler.emit(err, 'Fetching stages');
    this.hasErrorSubject$.next(true);
  }

  private navigateBackIfStagesFinished(stages: RequestStage[]) {
    if (stages.every((stage) => stage.hasFinished())) {
      this.notificationService.emit('info', 'Cleanup request finished. All stages were removed');
      this.navigateBack();
    }
  }

  private navigateBack() {
    this.route.paramMap.pipe(take(1)).subscribe((_) => this.router.navigate([this.navigator.toPoolOverview()]));
  }
}
