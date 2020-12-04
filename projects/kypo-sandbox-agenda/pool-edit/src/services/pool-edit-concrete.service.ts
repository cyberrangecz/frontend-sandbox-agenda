import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PoolApi } from '@muni-kypo-crp/sandbox-api';
import { SandboxDefinition } from '@muni-kypo-crp/sandbox-model';
import { Pool } from '@muni-kypo-crp/sandbox-model';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SandboxDefinitionSelectComponent } from '../components/sandbox-definition-select/sandbox-definition-select.component';
import { SandboxNotificationService, SandboxNavigator, SandboxErrorHandler } from '@muni-kypo-crp/sandbox-agenda';
import { PoolEditService } from './pool-edit.service';

@Injectable()
export class PoolEditConcreteService extends PoolEditService {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private navigator: SandboxNavigator,
    private notificationService: SandboxNotificationService,
    private errorHandler: SandboxErrorHandler,
    private api: PoolApi
  ) {
    super();
  }

  create(pool: Pool): Observable<any> {
    return this.api.createPool(pool).pipe(
      tap(
        (_) => this.notificationService.emit('success', 'Pool was created'),
        (err) => this.errorHandler.emit(err, 'Creating pool')
      ),
      switchMap((_) => from(this.router.navigate([this.navigator.toPoolOverview()])))
    );
  }

  selectDefinition(currSelected: SandboxDefinition): Observable<SandboxDefinition> {
    const dialogRef = this.dialog.open(SandboxDefinitionSelectComponent, { data: currSelected });
    return dialogRef.afterClosed();
  }
}
