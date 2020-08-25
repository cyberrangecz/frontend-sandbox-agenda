import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SandboxAllocationUnitsService } from './sandbox-allocation-units.service';
import { SandboxErrorHandler, SandboxNotificationService } from 'kypo-sandbox-agenda';
import { AllocationRequestsApi, PoolApi, SandboxAllocationUnitsApi } from 'kypo-sandbox-api';
import {
  createAllocationRequestApiSpy,
  createContextSpy,
  createErrorHandlerSpy,
  createMatDialogSpy,
  createNotificationSpy,
  createPagination,
  createPoolApiSpy,
  createSauApiSpy,
} from '../../../../../../../internal/src/testing/testing-commons.spec';
import { MatDialog } from '@angular/material/dialog';
import { asyncData, PaginatedResource, SentinelPagination } from '@sentinel/common';
import { skip, take } from 'rxjs/operators';
import { SandboxAllocationUnitsConcreteService } from './sandbox-allocation-units-concrete.service';
import { SandboxAgendaContext } from '../../../../../../../internal/src/services/sandox-agenda-context.service';
import { of, throwError } from 'rxjs';
import { SentinelDialogResultEnum } from '@sentinel/components/dialogs';
import { AllocationRequest } from 'kypo-sandbox-model';

describe('SandboxAllocationUnitsService', () => {
  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandler>;
  let notificationSpy: jasmine.SpyObj<SandboxNotificationService>;
  let allocationRequestsApiSpy: jasmine.SpyObj<AllocationRequestsApi>;
  let sauApiSpy: jasmine.SpyObj<SandboxAllocationUnitsApi>;
  let contextSpy: jasmine.SpyObj<SandboxAgendaContext>;
  let poolApiSpy: jasmine.SpyObj<PoolApi>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  let service: SandboxAllocationUnitsConcreteService;

  beforeEach(() => {
    errorHandlerSpy = createErrorHandlerSpy();
    notificationSpy = createNotificationSpy();
    allocationRequestsApiSpy = createAllocationRequestApiSpy();
    sauApiSpy = createSauApiSpy();
    poolApiSpy = createPoolApiSpy();
    contextSpy = createContextSpy();
    dialogSpy = createMatDialogSpy();
    TestBed.configureTestingModule({
      providers: [
        SandboxAllocationUnitsConcreteService,
        { provide: AllocationRequestsApi, useValue: allocationRequestsApiSpy },
        { provide: PoolApi, useValue: poolApiSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: SandboxAllocationUnitsApi, useValue: sauApiSpy },
        { provide: SandboxAgendaContext, useValue: contextSpy },
        { provide: SandboxNotificationService, useValue: notificationSpy },
        { provide: SandboxErrorHandler, useValue: errorHandlerSpy },
      ],
    });
    service = TestBed.inject(SandboxAllocationUnitsConcreteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call api to get sandbox allocation units', (done) => {
    const pagination = createPagination();
    poolApiSpy.getPoolsSandboxAllocationUnits.and.returnValue(asyncData(null));

    service
      .getAll(0, pagination)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(poolApiSpy.getPoolsSandboxAllocationUnits).toHaveBeenCalledTimes(1);
          done();
        },
        (_) => fail
      );
  });

  it('should emit next value when data received from api', (done) => {
    const pagination = createPagination();
    const mockData = createMock();
    poolApiSpy.getPoolsSandboxAllocationUnits.and.returnValue(asyncData(mockData));

    service.units$.pipe(skip(1), take(1)).subscribe(
      (emitted) => {
        expect(emitted).toBe(mockData);
        done();
      },
      (_) => fail()
    );
    service.getAll(0, pagination).subscribe();
  });

  it('should call error handler on err', (done) => {
    const pagination = createPagination();
    poolApiSpy.getPoolsSandboxAllocationUnits.and.returnValue(throwError({ status: 404 }));

    service
      .getAll(0, pagination)
      .pipe(take(1))
      .subscribe(
        (_) => fail(),
        (_) => {
          expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
          done();
        }
      );
  });

  it('should open dialog and call api if confirmed on creation of cleanup request', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(SentinelDialogResultEnum.CONFIRMED) } as any);
    const mockData = createMock();
    const request = new AllocationRequest();
    request.id = 0;
    poolApiSpy.getPoolsSandboxAllocationUnits.and.returnValue(asyncData(mockData));
    sauApiSpy.createCleanupRequest.and.returnValue(asyncData(null));

    service
      .cleanup(request)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(dialogSpy.open).toHaveBeenCalledTimes(1);
          expect(sauApiSpy.createCleanupRequest).toHaveBeenCalledTimes(1);
          done();
        },
        (_) => fail()
      );
  });

  it('should open dialog and not call api if dialog dismissed on creation of cleanup request', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(SentinelDialogResultEnum.DISMISSED) } as any);
    const mockData = createMock();
    const request = new AllocationRequest();
    request.id = 0;
    poolApiSpy.getPoolsSandboxAllocationUnits.and.returnValue(asyncData(mockData));
    sauApiSpy.createCleanupRequest.and.returnValue(asyncData(null));

    service
      .cleanup(request)
      .pipe(take(1))
      .subscribe(
        (_) => fail(),
        (_) => fail(),
        () => {
          expect(dialogSpy.open).toHaveBeenCalledTimes(1);
          expect(sauApiSpy.createCleanupRequest).toHaveBeenCalledTimes(0);
          done();
        }
      );
  });

  it('should start polling', fakeAsync(() => {
    const mockData = createMock();
    poolApiSpy.getPoolsSandboxAllocationUnits.and.returnValue(asyncData(mockData));

    const subscription = service.units$.subscribe();
    assertPoll(1);
    subscription.unsubscribe();
  }));

  it('should stop polling on error', fakeAsync(() => {
    const mockData = createMock();
    poolApiSpy.getPoolsSandboxAllocationUnits.and.returnValues(
      asyncData(mockData),
      asyncData(mockData),
      throwError({ status: 400 })
    ); // throw error on third call

    const subscription = service.units$.subscribe();
    assertPoll(3);
    tick(5 * contextSpy.config.pollingPeriod);
    expect(poolApiSpy.getPoolsSandboxAllocationUnits).toHaveBeenCalledTimes(3);
    subscription.unsubscribe();
  }));

  it('should start polling again after request is successful', fakeAsync(() => {
    const pagination = createPagination();
    const mockData = createMock();
    poolApiSpy.getPoolsSandboxAllocationUnits.and.returnValues(
      asyncData(mockData),
      asyncData(mockData),
      throwError({ status: 400 }),
      asyncData(mockData),
      asyncData(mockData),
      asyncData(mockData)
    );

    const subscription = service.units$.subscribe();
    expect(poolApiSpy.getPoolsSandboxAllocationUnits).toHaveBeenCalledTimes(0);
    assertPoll(3);
    tick(contextSpy.config.pollingPeriod);
    expect(poolApiSpy.getPoolsSandboxAllocationUnits).toHaveBeenCalledTimes(3);
    tick(5 * contextSpy.config.pollingPeriod);
    expect(poolApiSpy.getPoolsSandboxAllocationUnits).toHaveBeenCalledTimes(3);
    service.getAll(0, pagination).subscribe();
    expect(poolApiSpy.getPoolsSandboxAllocationUnits).toHaveBeenCalledTimes(4);
    assertPoll(3, 4);
    subscription.unsubscribe();
  }));

  function createMock() {
    return new PaginatedResource([], new SentinelPagination(1, 0, 5, 5, 1));
  }

  function assertPoll(times: number, initialHaveBeenCalledTimes: number = 0) {
    let calledTimes = initialHaveBeenCalledTimes;
    for (let i = 0; i < times; i++) {
      tick(contextSpy.config.pollingPeriod);
      calledTimes = calledTimes + 1;
      expect(poolApiSpy.getPoolsSandboxAllocationUnits).toHaveBeenCalledTimes(calledTimes);
    }
  }
});
