import { async, TestBed } from '@angular/core/testing';
import { asyncData, PaginatedResource, OffsetPagination } from '@sentinel/common';
import { skip, take } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SandboxErrorHandler } from '@muni-kypo-crp/sandbox-agenda';
import { VMImagesApi } from '@muni-kypo-crp/sandbox-api';
import { VMImagesConcreteService } from './vm-images-concrete.service';
import {
  createContextSpy,
  createErrorHandlerSpy,
  createPagination,
  createVMImagesApiSpy,
} from '../../../internal/src/testing/testing-commons.spec';
import { SandboxAgendaContext } from '../../../internal/src/services/sandox-agenda-context.service';

describe('VMImagesConcreteService', () => {
  let service: VMImagesConcreteService;
  let VMImagesApiSpy: jasmine.SpyObj<VMImagesApi>;
  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandler>;
  let contextSpy: jasmine.SpyObj<SandboxAgendaContext>;

  beforeEach(async(() => {
    errorHandlerSpy = createErrorHandlerSpy();
    VMImagesApiSpy = createVMImagesApiSpy();
    contextSpy = createContextSpy();

    TestBed.configureTestingModule({
      providers: [
        VMImagesConcreteService,
        { provide: SandboxErrorHandler, useValue: errorHandlerSpy },
        { provide: VMImagesApi, useValue: VMImagesApiSpy },
        { provide: SandboxAgendaContext, useValue: contextSpy },
      ],
    });
    service = TestBed.inject(VMImagesConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call api to get available images', (done) => {
    const pagination = createPagination();
    VMImagesApiSpy.getAvailableImages.and.returnValue(asyncData(null));

    service.getAvailableImages(pagination).subscribe(
      () => {
        expect(VMImagesApiSpy.getAvailableImages).toHaveBeenCalledTimes(1);
        done();
      },
      () => fail
    );
  });

  it('should emit next value when data received from api', (done) => {
    const pagination = createPagination();
    const mockData = createMock();
    VMImagesApiSpy.getAvailableImages.and.returnValue(asyncData(mockData));

    service.resource$.pipe(skip(1), take(1)).subscribe(
      (emitted) => {
        expect(emitted).toBe(mockData);
        done();
      },
      () => fail
    );
    service.getAvailableImages(pagination).subscribe();
  });

  it('should emit error on error state', (done) => {
    const pagination = createPagination();
    VMImagesApiSpy.getAvailableImages.and.returnValue(throwError(null));

    service.getAvailableImages(pagination).subscribe(
      () => fail,
      () => {
        expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  function createMock() {
    return new PaginatedResource([], new OffsetPagination(1, 0, 5, 5, 1));
  }
});
