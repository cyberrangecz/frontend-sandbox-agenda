import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { asyncData } from '@sentinel/common';
import { SandboxErrorHandler, SandboxNavigator, SandboxNotificationService } from '@kypo/sandbox-agenda';
import { PoolApi } from 'kypo-sandbox-api';
import { Pool } from 'kypo-sandbox-model';
import { PoolEditConcreteService } from './pool-edit-concrete.service';
import {
  createErrorHandlerSpy,
  createMatDialogSpy,
  createNavigatorSpy,
  createNotificationSpy,
  createPoolApiSpy,
} from '../../../internal/src/testing/testing-commons.spec';

describe('PoolEditConcreteService', () => {
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let navigatorSpy: jasmine.SpyObj<SandboxNavigator>;
  let notificationSpy: jasmine.SpyObj<SandboxNotificationService>;
  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandler>;
  let poolApiSpy: jasmine.SpyObj<PoolApi>;
  let service: PoolEditConcreteService;

  beforeEach(async(() => {
    dialogSpy = createMatDialogSpy();
    navigatorSpy = createNavigatorSpy();
    notificationSpy = createNotificationSpy();
    errorHandlerSpy = createErrorHandlerSpy();
    poolApiSpy = createPoolApiSpy();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        PoolEditConcreteService,
        { provide: MatDialog, useValue: dialogSpy },
        { provide: SandboxNavigator, useValue: navigatorSpy },
        { provide: SandboxNotificationService, useValue: notificationSpy },
        { provide: SandboxErrorHandler, useValue: errorHandlerSpy },
        { provide: PoolApi, useValue: poolApiSpy },
      ],
    });
    service = TestBed.inject(PoolEditConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create pool and try to navigate to created pool', (done) => {
    const mockData = createMock();
    poolApiSpy.createPool.and.returnValue(asyncData(mockData));
    navigatorSpy.toPoolOverview.and.returnValue('/');

    service.create(mockData).subscribe((_) => done(), fail);
    expect(poolApiSpy.createPool).toHaveBeenCalledTimes(1);
  });

  function createMock() {
    const pool = new Pool();
    pool.id = 1;
    pool.definitionId = 1;
    pool.lockId = 1;
    pool.usedSize = 10;
    pool.maxSize = 20;
    return pool;
  }
});
