import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SandboxDefinitionApi } from '@muni-kypo-crp/sandbox-api';
import { SandboxDefinition } from '@muni-kypo-crp/sandbox-model';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxNotificationService, SandboxNavigator, SandboxErrorHandler } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxDefinitionEditService } from './sandbox-definition-edit.service';

@Injectable()
export class SandboxDefinitionEditConcreteService extends SandboxDefinitionEditService {
  constructor(
    private api: SandboxDefinitionApi,
    private router: Router,
    private navigator: SandboxNavigator,
    private alertService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler
  ) {
    super();
  }

  /**
   * Creates a sandbox definition, informs about the result and updates list of sandbox definitions or handles an error
   * @param sandboxDefinition Sandbox definition to create
   */
  create(sandboxDefinition: SandboxDefinition): Observable<any> {
    return this.api.create(sandboxDefinition).pipe(
      tap(
        (_) => this.alertService.emit('success', 'Sandbox definition was successfully created'),
        (err) => this.errorHandler.emit(err, 'Creating sandbox definition')
      ),
      switchMap((_) => this.router.navigate([this.navigator.toSandboxDefinitionOverview()]))
    );
  }
}
