import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KypoBaseComponent, KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { SandboxDefinition } from 'kypo-sandbox-model';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { SandboxAgendaContext } from '../../../../services/internal/sandox-agenda-context.service';
import { SandboxDefinitionOverviewConcreteService } from '../../../../services/sandbox-definition/sandbox-definition-overview-concrete.service';
import { SandboxDefinitionOverviewService } from '../../../../services/sandbox-definition/sandbox-definition-overview.service';

@Component({
  selector: 'kypo-sandbox-definition-select',
  templateUrl: './sandbox-definition-select.component.html',
  styleUrls: ['./sandbox-definition-select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SandboxDefinitionOverviewService, useClass: SandboxDefinitionOverviewConcreteService }],
})
export class SandboxDefinitionSelectComponent extends KypoBaseComponent implements OnInit {
  readonly PAGE_SIZE: number;

  definitions$: Observable<KypoPaginatedResource<SandboxDefinition>>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  selected: SandboxDefinition[];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public preselected: SandboxDefinition,
    public dialogRef: MatDialogRef<SandboxDefinitionSelectComponent>,
    private context: SandboxAgendaContext,
    private definitionService: SandboxDefinitionOverviewService
  ) {
    super();
    this.selected = [preselected];
    this.PAGE_SIZE = this.context.config.defaultPaginationSize;
  }

  ngOnInit(): void {
    const pagination = new KypoRequestedPagination(0, this.PAGE_SIZE, '', '');
    this.definitions$ = this.definitionService.resource$;
    this.isLoading$ = this.definitionService.isLoading$;
    this.hasError$ = this.definitionService.hasError$;
    this.definitionService
      .getAll(pagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  fetch(pagination: KypoRequestedPagination) {
    this.definitionService
      .getAll(pagination)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  confirm() {
    this.dialogRef.close(this.selected[0]);
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  /**
   * Updated selected sandbox definition
   * @param selected selected sandbox definition
   */
  onSelectionChange(selected: SandboxDefinition[]) {
    this.selected = selected;
  }
}
