import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KypoBaseComponent } from 'kypo-common';
import { SandboxInstance } from 'kypo-sandbox-model';
import { Kypo2TopologyErrorService } from 'kypo2-topology-graph';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { SANDBOX_INSTANCE_DATA_ATTRIBUTE_NAME } from '../../../model/client/activated-route-data-attributes';
import { SandboxErrorHandler } from '../../../services/client/sandbox-error.handler';

/**
 * Smart component of sandbox instance topology page
 */
@Component({
  selector: 'kypo-sandbox-instance-topology',
  templateUrl: './sandbox-instance-topology.component.html',
  styleUrls: ['./sandbox-instance-topology.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxInstanceTopologyComponent extends KypoBaseComponent implements OnInit {
  sandboxInstance$: Observable<SandboxInstance>;
  topologyWidth: number;
  topologyHeight: number;

  constructor(
    private activeRoute: ActivatedRoute,
    private topologyErrorService: Kypo2TopologyErrorService,
    private errorHandler: SandboxErrorHandler
  ) {
    super();
  }

  ngOnInit() {
    this.sandboxInstance$ = this.activeRoute.data.pipe(
      takeWhile((_) => this.isAlive),
      map((data) => data[SANDBOX_INSTANCE_DATA_ATTRIBUTE_NAME])
    );
    this.calculateTopologySize();
    this.subscribeToTopologyErrorHandler();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.calculateTopologySize();
  }

  private calculateTopologySize() {
    this.topologyWidth = window.innerWidth - 300;
    this.topologyHeight = window.innerHeight - 260;
  }

  private subscribeToTopologyErrorHandler() {
    this.topologyErrorService.error$.pipe(takeWhile((_) => this.isAlive)).subscribe({
      next: (event) => this.errorHandler.emit(event.err, event.action),
      error: (err) => this.errorHandler.emit(err, 'There is a problem with topology error handler.'),
    });
  }
}
