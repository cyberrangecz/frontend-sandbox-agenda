import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SentinelBaseDirective, PaginatedResource, RequestedPagination } from '@sentinel/common';
import { SandboxDefinition } from '@muni-kypo-crp/sandbox-model';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import {
  PaginationService,
  SandboxDefinitionOverviewService,
  SandboxDefinitionOverviewConcreteService,
} from '@muni-kypo-crp/sandbox-agenda/internal';

@Component({
  selector: 'kypo-sandbox-definition-select',
  templateUrl: './sandbox-definition-select.component.html',
  styleUrls: ['./sandbox-definition-select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SandboxDefinitionOverviewService, useClass: SandboxDefinitionOverviewConcreteService }],
})
export class SandboxDefinitionSelectComponent extends SentinelBaseDirective implements OnInit {
  readonly PAGE_SIZE: number;

  definitions$: Observable<PaginatedResource<SandboxDefinition>>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  selected: SandboxDefinition[];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public preselected: SandboxDefinition,
    public dialogRef: MatDialogRef<SandboxDefinitionSelectComponent>,
    private paginationService: PaginationService,
    private definitionService: SandboxDefinitionOverviewService
  ) {
    super();
    this.selected = [preselected];
    this.PAGE_SIZE = this.paginationService.getPagination();
  }

  ngOnInit(): void {
    const pagination = new RequestedPagination(0, this.PAGE_SIZE, '', '');
    this.definitions$ = this.definitionService.resource$;
    this.isLoading$ = this.definitionService.isLoading$;
    this.hasError$ = this.definitionService.hasError$;
    this.definitionService
      .getAll(pagination)
      .pipe(
        map((resources) => {
          resources.elements.map(
            (definition) => (definition.title = `${definition.title} (ID: ${definition.id}, rev: ${definition.rev})`)
          );
          return resources;
        }),
        takeWhile(() => this.isAlive)
      )
      .subscribe();
  }

  fetch(pagination: RequestedPagination): void {
    this.paginationService.setPagination(pagination.size);
    this.definitionService
      .getAll(pagination)
      .pipe(
        map((resources) => {
          resources.elements.map(
            (definition) => (definition.title = `${definition.title} (ID: ${definition.id}, rev: ${definition.rev})`)
          );
          return resources;
        }),
        takeWhile(() => this.isAlive)
      )
      .subscribe();
  }

  confirm(): void {
    this.dialogRef.close(this.selected[0]);
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }

  /**
   * Updated selected sandbox definition
   * @param selected selected sandbox definition
   */
  onSelectionChange(selected: SandboxDefinition[]): void {
    this.selected = selected;
  }
}
