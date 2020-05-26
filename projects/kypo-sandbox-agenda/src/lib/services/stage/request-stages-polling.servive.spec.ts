import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { asyncData, KypoPaginatedResource, KypoPagination } from 'kypo-common';
import { AllocationRequest, AnsibleAllocationStage, Request, RequestStage } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { skip } from 'rxjs/operators';
import { RequestStagesPollingService } from './request-stages-polling.service';

class TestRequestStagesPollingService extends RequestStagesPollingService {
  constructor(pageSize: number, pollPeriod: number) {
    super(pageSize, pollPeriod);
  }

  protected repeatLastGetAllRequest(): Observable<KypoPaginatedResource<RequestStage>> {
    return this.getAll(this.request);
  }

  getAll(request: Request): Observable<KypoPaginatedResource<RequestStage>> {
    const stages = [new AnsibleAllocationStage(), new AnsibleAllocationStage(), new AnsibleAllocationStage()];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    return asyncData(new KypoPaginatedResource(stages, pagination));
  }
}

describe('RequestStagesPollingService', () => {
  let service: RequestStagesPollingService;
  const POLL_PERIOD = 5;

  beforeEach(async(() => {
    const testService = new TestRequestStagesPollingService(10, POLL_PERIOD);

    TestBed.configureTestingModule({
      providers: [{ provide: RequestStagesPollingService, useValue: testService }],
    });
    service = TestBed.inject(RequestStagesPollingService);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should start polling', fakeAsync(() => {
    const stages = [new AnsibleAllocationStage(), new AnsibleAllocationStage(), new AnsibleAllocationStage()];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    spyOn(service, 'getAll').and.returnValue(asyncData(new KypoPaginatedResource(stages, pagination)));
    expect(service.getAll).toHaveBeenCalledTimes(0);

    const req = new AllocationRequest();

    service.startPolling(req);
    const subscription = service.resource$.subscribe();
    assertPoll(5);
    subscription.unsubscribe();
  }));

  it('should stop polling when all stages are finished', fakeAsync(() => {
    const finishedStage1 = new AnsibleAllocationStage();
    const finishedStage2 = new AnsibleAllocationStage();
    spyOn(finishedStage1, 'hasFinished').and.returnValue(true);
    spyOn(finishedStage2, 'hasFinished').and.returnValue(true);
    const regularStages = [new AnsibleAllocationStage(), new AnsibleAllocationStage(), new AnsibleAllocationStage()];
    const finishedStages = [finishedStage1, finishedStage2];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    spyOn(service, 'getAll').and.returnValues(
      asyncData(new KypoPaginatedResource(regularStages, pagination)),
      asyncData(new KypoPaginatedResource(regularStages, pagination)),
      asyncData(new KypoPaginatedResource(finishedStages, pagination))
    );
    expect(service.getAll).toHaveBeenCalledTimes(0);

    const req = new AllocationRequest();

    service.startPolling(req);
    const subscription = service.resource$.subscribe();
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(2);
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(3);
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(3);
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(3);
    subscription.unsubscribe();
  }));

  it('should stop polling when some stages fails', fakeAsync(() => {
    const failedStage = new AnsibleAllocationStage();
    const runningStage = new AnsibleAllocationStage();
    spyOn(failedStage, 'hasFailed').and.returnValue(true);
    spyOn(runningStage, 'hasFinished').and.returnValue(false);
    const regularStages = [new AnsibleAllocationStage(), new AnsibleAllocationStage(), new AnsibleAllocationStage()];
    const failedStages = [failedStage, runningStage];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    spyOn(service, 'getAll').and.returnValues(
      asyncData(new KypoPaginatedResource(regularStages, pagination)),
      asyncData(new KypoPaginatedResource(regularStages, pagination)),
      asyncData(new KypoPaginatedResource(failedStages, pagination))
    );
    expect(service.getAll).toHaveBeenCalledTimes(0);

    const req = new AllocationRequest();

    service.startPolling(req);
    const subscription = service.resource$.subscribe();
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(2);
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(3);
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(3);
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(3);
    subscription.unsubscribe();
  }));

  it('should return value at least once even when all stages are finished', fakeAsync(() => {
    const finishedStage1 = new AnsibleAllocationStage();
    const finishedStage2 = new AnsibleAllocationStage();
    spyOn(finishedStage1, 'hasFinished').and.returnValue(true);
    spyOn(finishedStage2, 'hasFinished').and.returnValue(true);
    const finishedStages = [finishedStage1, finishedStage2];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    spyOn(service, 'getAll').and.returnValue(asyncData(new KypoPaginatedResource(finishedStages, pagination)));
    expect(service.getAll).toHaveBeenCalledTimes(0);

    const req = new AllocationRequest();

    service.startPolling(req);
    const subscription = service.resource$.subscribe();
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(1);
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(1);
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(1);
    tick(POLL_PERIOD);
    expect(service.getAll).toHaveBeenCalledTimes(1);
    subscription.unsubscribe();
  }));

  it('should emit value at least once even when all stages are finished', fakeAsync(() => {
    const finishedStage1 = new AnsibleAllocationStage();
    const finishedStage2 = new AnsibleAllocationStage();
    spyOn(finishedStage1, 'hasFinished').and.returnValue(true);
    spyOn(finishedStage2, 'hasFinished').and.returnValue(true);
    const finishedStages = [finishedStage1, finishedStage2];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    const expectedResource = new KypoPaginatedResource(finishedStages, pagination);
    spyOn(service, 'getAll').and.returnValue(asyncData(expectedResource));
    expect(service.getAll).toHaveBeenCalledTimes(0);

    const req = new AllocationRequest();

    service.startPolling(req);
    let pollResult;
    const subscription = service.resource$.pipe(skip(1)).subscribe((res) => (pollResult = res));
    tick(POLL_PERIOD);
    expect(pollResult).toEqual(expectedResource);
    tick(POLL_PERIOD);
    expect(pollResult).toEqual(expectedResource);
    tick(POLL_PERIOD);
    expect(pollResult).toEqual(expectedResource);
    tick(POLL_PERIOD);
    expect(pollResult).toEqual(expectedResource);
    subscription.unsubscribe();
  }));

  it('should emit value at least once even when some stage failed', fakeAsync(() => {
    const failedStage = new AnsibleAllocationStage();
    const inQueueStage = new AnsibleAllocationStage();
    spyOn(failedStage, 'hasFailed').and.returnValue(true);
    spyOn(inQueueStage, 'isInQueue').and.returnValue(true);
    const stages = [failedStage, inQueueStage];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    const expectedResource = new KypoPaginatedResource(stages, pagination);
    spyOn(service, 'getAll').and.returnValue(asyncData(expectedResource));
    expect(service.getAll).toHaveBeenCalledTimes(0);

    const req = new AllocationRequest();

    service.startPolling(req);
    let pollResult;
    const subscription = service.resource$.pipe(skip(1)).subscribe((res) => (pollResult = res));
    tick(POLL_PERIOD);
    expect(pollResult).toEqual(expectedResource);
    tick(POLL_PERIOD);
    expect(pollResult).toEqual(expectedResource);
    tick(POLL_PERIOD);
    expect(pollResult).toEqual(expectedResource);
    tick(POLL_PERIOD);
    expect(pollResult).toEqual(expectedResource);
    subscription.unsubscribe();
  }));

  function assertPoll(times: number, initialHaveBeenCalledTimes: number = 1) {
    let calledTimes = initialHaveBeenCalledTimes;
    for (let i = 0; i < times; i++) {
      tick(POLL_PERIOD);
      calledTimes = calledTimes + 1;
      expect(service.getAll).toHaveBeenCalledTimes(calledTimes);
    }
  }
});
