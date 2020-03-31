import {SandboxDefinitionDetailService} from './sandbox-definition-detail.service';
import {Observable} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {SandboxDefinitionApi} from 'kypo-sandbox-api';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {SandboxDefinition} from 'kypo-sandbox-model';
import {SandboxNavigator} from '../../client/sandbox-navigator.service';
import {SandboxNotificationService} from '../../client/sandbox-notification.service';
import {SandboxErrorHandlerService} from '../../client/sandbox-error-handler.service';

@Injectable()
export class SandboxDefinitionDetailConcreteService extends SandboxDefinitionDetailService {

  constructor(private api: SandboxDefinitionApi,
              private router: Router,
              private navigator: SandboxNavigator,
              private alertService: SandboxNotificationService,
              private errorHandler: SandboxErrorHandlerService) {
    super();
  }

  /**
   * Creates a sandbox definition, informs about the result and updates list of sandbox definitions or handles an error
   * @param sandboxDefinition Sandbox definition to create
   */
  create(sandboxDefinition: SandboxDefinition): Observable<any> {
    return this.api.create(sandboxDefinition)
      .pipe(
        tap(_ => this.alertService.emit('success', 'Sandbox definition was successfully created'),
          err => this.errorHandler.emit(err, 'Creating sandbox definition')
        ),
        switchMap(_ => this.router.navigate([this.navigator.toSandboxDefinitionOverview()]))
      );
  }
}
