import {Injectable} from '@angular/core';
import {PoolEditService} from './pool-edit.service';
import {Pool} from 'kypo-sandbox-model';
import {from, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {switchMap, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {SandboxDefinition} from 'kypo-sandbox-model';
import {PoolApi} from 'kypo-sandbox-api';
import {SandboxErrorHandler} from '../client/sandbox-error.handler';
import {SandboxNotificationService} from '../client/sandbox-notification.service';
import {SandboxNavigator} from '../client/sandbox-navigator.service';
import {SandboxDefinitionSelectComponent} from '../../components/pool/edit/sandbox-definition-select/sandbox-definition-select.component';

@Injectable()
export class PoolEditConcreteService extends PoolEditService {

  constructor(private router: Router,
              private dialog: MatDialog,
              private navigator: SandboxNavigator,
              private notificationService: SandboxNotificationService,
              private errorHandler: SandboxErrorHandler,
              private api: PoolApi) {
    super();
  }

  create(pool: Pool): Observable<any> {
    return this.api.createPool(pool)
      .pipe(
        tap(_ => this.notificationService.emit('success', 'Pool was created'),
          err => this.errorHandler.emit(err, 'Creating pool')),
        switchMap(_ => from(this.router.navigate([this.navigator.toPoolOverview()])))
      );
  }

  selectDefinition(currSelected: SandboxDefinition): Observable<SandboxDefinition> {
    const dialogRef = this.dialog.open(SandboxDefinitionSelectComponent, { data: currSelected });
    return dialogRef.afterClosed();
  }
}
