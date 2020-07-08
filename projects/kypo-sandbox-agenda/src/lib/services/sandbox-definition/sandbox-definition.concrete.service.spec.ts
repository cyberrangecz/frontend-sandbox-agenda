import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PaginatedResource, SentinelPagination, asyncData, RequestedPagination } from '@sentinel/common';
import { SandboxDefinitionApi } from 'kypo-sandbox-api';
import { SandboxDefinition } from 'kypo-sandbox-model';
import { throwError } from 'rxjs';
import { skip } from 'rxjs/operators';
import {
  createContextSpy,
  createDefinitionApiSpy,
  createErrorHandlerSpy,
  createMatDialogSpy,
  createNavigatorSpy,
  createNotificationSpy,
  createRouterSpy,
} from '../../testing/testing-commons';
import { SandboxErrorHandler } from '../client/sandbox-error.handler';
import { SandboxNavigator } from '../client/sandbox-navigator.service';
import { SandboxNotificationService } from '../client/sandbox-notification.service';
import { SandboxAgendaContext } from '../internal/sandox-agenda-context.service';
import { SandboxDefinitionOverviewConcreteService } from './sandbox-definition-overview-concrete.service';

describe('SandboxDefinitionOverviewConcreteService', () => {
  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandler>;
  let apiSpy: jasmine.SpyObj<SandboxDefinitionApi>;
  let notificationSpy: jasmine.SpyObj<SandboxNotificationService>;
  let navigatorSpy: jasmine.SpyObj<SandboxNavigator>;
  let contextSpy: jasmine.SpyObj<SandboxAgendaContext>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;
  let service: SandboxDefinitionOverviewConcreteService;

  beforeEach(async(() => {
    errorHandlerSpy = createErrorHandlerSpy();
    notificationSpy = createNotificationSpy();
    navigatorSpy = createNavigatorSpy();
    contextSpy = createContextSpy();
    dialogSpy = createMatDialogSpy();
    apiSpy = createDefinitionApiSpy();
    routerSpy = createRouterSpy();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        SandboxDefinitionOverviewConcreteService,
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SandboxDefinitionApi, useValue: apiSpy },
        { provide: SandboxNotificationService, useValue: notificationSpy },
        { provide: SandboxNavigator, useValue: navigatorSpy },
        { provide: SandboxAgendaContext, useValue: contextSpy },
        { provide: SandboxErrorHandler, useValue: errorHandlerSpy },
      ],
    });
    service = TestBed.inject(SandboxDefinitionOverviewConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call error handler on err', (done) => {
    const pagination = createPagination();
    apiSpy.getAll.and.returnValue(throwError(null));

    service.getAll(pagination).subscribe(
      (_) => fail,
      (_) => {
        expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
        done();
      }
    );
    expect(apiSpy.getAll).toHaveBeenCalledTimes(1);
  });

  it('should emit next value on update (sandboxDefinitions)', (done) => {
    const pagination = createPagination();
    const mockData = createMockData();
    apiSpy.getAll.and.returnValue(asyncData(mockData));

    service.resource$.pipe(skip(1)).subscribe((emitted) => {
      expect(emitted).toBe(mockData);
      done();
    }, fail);
    service.getAll(pagination).subscribe((_) => done(), fail);
  });

  function createPagination() {
    return new RequestedPagination(1, 5, '', '');
  }

  function createMockData() {
    const sandbox1 = new SandboxDefinition();
    sandbox1.id = 1;
    const sandbox2 = new SandboxDefinition();
    sandbox2.id = 2;
    return new PaginatedResource<SandboxDefinition>([sandbox1, sandbox2], new SentinelPagination(1, 2, 5, 2, 1));
  }
});
