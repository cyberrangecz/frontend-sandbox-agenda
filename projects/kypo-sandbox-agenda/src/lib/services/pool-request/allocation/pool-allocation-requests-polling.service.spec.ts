import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CsirtMuDialogResultEnum } from 'csirt-mu-common';
import { asyncData } from 'kypo-common';
import { KypoPaginatedResource } from 'kypo-common';
import { KypoPagination } from 'kypo-common';
import { PoolRequestApi } from 'kypo-sandbox-api';
import { AllocationRequest } from 'kypo-sandbox-model';
import { of, throwError } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import {
  createContextSpy,
  createErrorHandlerSpy,
  createMatDialogSpy,
  createNotificationSpy,
  createPagination,
  createRequestApiSpy,
} from '../../../testing/testing-commons';
import { SandboxErrorHandler } from '../../client/sandbox-error.handler';
import { SandboxNotificationService } from '../../client/sandbox-notification.service';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { PoolAllocationRequestsConcreteService } from './pool-allocation-requests-concrete.service';

describe('PoolAllocationRequestsPollingService', () => {
  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandler>;
  let notificationSpy: jasmine.SpyObj<SandboxNotificationService>;
  let apiSpy: jasmine.SpyObj<PoolRequestApi>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let contextSpy: jasmine.SpyObj<SandboxAgendaContext>;

  let service: PoolAllocationRequestsConcreteService;

  beforeEach(async(() => {
    errorHandlerSpy = createErrorHandlerSpy();
    notificationSpy = createNotificationSpy();
    apiSpy = createRequestApiSpy();
    contextSpy = createContextSpy();
    dialogSpy = createMatDialogSpy();
    TestBed.configureTestingModule({
      providers: [
        PoolAllocationRequestsConcreteService,
        { provide: PoolRequestApi, useValue: apiSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: SandboxAgendaContext, useValue: contextSpy },
        { provide: SandboxNotificationService, useValue: notificationSpy },
        { provide: SandboxErrorHandler, useValue: errorHandlerSpy },
      ],
    });
    service = TestBed.inject(PoolAllocationRequestsConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call api to get allocation requests', (done) => {
    const pagination = createPagination();
    apiSpy.getAllocationRequests.and.returnValue(asyncData(null));

    service
      .getAll(0, pagination)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(apiSpy.getAllocationRequests).toHaveBeenCalledTimes(1);
          done();
        },
        (_) => fail
      );
  });

  it('should emit next value when data received from api', (done) => {
    const pagination = createPagination();
    const mockData = createMock();
    apiSpy.getAllocationRequests.and.returnValue(asyncData(mockData));

    service.resource$.pipe(skip(1), take(1)).subscribe(
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
    apiSpy.getAllocationRequests.and.returnValue(throwError({ status: 400 }));

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

  it('should open dialog and call api if confirmed on cancel', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(CsirtMuDialogResultEnum.CONFIRMED) } as any);
    const mockData = createMock();
    const request = new AllocationRequest();
    request.id = 0;
    apiSpy.getAllocationRequests.and.returnValue(asyncData(mockData));
    apiSpy.cancelAllocationRequest.and.returnValue(asyncData(null));

    service
      .cancel(request)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(dialogSpy.open).toHaveBeenCalledTimes(1);
          expect(apiSpy.cancelAllocationRequest).toHaveBeenCalledTimes(1);
          done();
        },
        (_) => fail()
      );
  });

  it('should open dialog and not call api if dialog dismissed on cancel', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(CsirtMuDialogResultEnum.DISMISSED) } as any);
    const mockData = createMock();
    const request = new AllocationRequest();
    request.id = 0;
    apiSpy.getAllocationRequests.and.returnValue(asyncData(mockData));
    apiSpy.cancelAllocationRequest.and.returnValue(asyncData(null));

    service
      .cancel(request)
      .pipe(take(1))
      .subscribe(
        (_) => fail(),
        (_) => fail(),
        () => {
          expect(dialogSpy.open).toHaveBeenCalledTimes(1);
          expect(apiSpy.cancelAllocationRequest).toHaveBeenCalledTimes(0);
          done();
        }
      );
  });

  it('should start polling', fakeAsync(() => {
    const mockData = createMock();
    apiSpy.getAllocationRequests.and.returnValue(asyncData(mockData));

    const subscription = service.resource$.subscribe();
    assertPoll(1);
    subscription.unsubscribe();
  }));

  it('should stop polling on error', fakeAsync(() => {
    const mockData = createMock();
    apiSpy.getAllocationRequests.and.returnValues(
      asyncData(mockData),
      asyncData(mockData),
      throwError({ status: 400 })
    ); // throw error on third call

    const subscription = service.resource$.subscribe();
    assertPoll(3);
    tick(5 * contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationRequests).toHaveBeenCalledTimes(3);
    subscription.unsubscribe();
  }));

  it('should start polling again after request is successful', fakeAsync(() => {
    const pagination = createPagination();
    const mockData = createMock();
    apiSpy.getAllocationRequests.and.returnValues(
      asyncData(mockData),
      asyncData(mockData),
      throwError({ status: 400 }),
      asyncData(mockData),
      asyncData(mockData),
      asyncData(mockData)
    );

    const subscription = service.resource$.subscribe();
    expect(apiSpy.getAllocationRequests).toHaveBeenCalledTimes(0);
    assertPoll(3);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationRequests).toHaveBeenCalledTimes(3);
    tick(5 * contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationRequests).toHaveBeenCalledTimes(3);
    service.getAll(0, pagination).subscribe();
    expect(apiSpy.getAllocationRequests).toHaveBeenCalledTimes(4);
    assertPoll(3, 4);
    subscription.unsubscribe();
  }));

  function createMock() {
    return new KypoPaginatedResource([], new KypoPagination(1, 0, 5, 5, 1));
  }

  function assertPoll(times: number, initialHaveBeenCalledTimes: number = 0) {
    let calledTimes = initialHaveBeenCalledTimes;
    for (let i = 0; i < times; i++) {
      tick(contextSpy.config.pollingPeriod);
      calledTimes = calledTimes + 1;
      expect(apiSpy.getAllocationRequests).toHaveBeenCalledTimes(calledTimes);
    }
  }
});
