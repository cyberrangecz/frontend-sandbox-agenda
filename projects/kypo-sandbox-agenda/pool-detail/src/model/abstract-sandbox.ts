import {
  AllocationRequest,
  CleanupRequest,
  RequestStageState,
  SandboxAllocationUnit,
  SandboxInstance,
} from '@muni-kypo-crp/sandbox-model';
import { AbstractSandboxState } from './enums/abstract-sandox-state.enum';

export class AbstractSandbox {
  id: number;
  poolId: number;
  name: string;
  createdAt: Date;
  createdBy: string;
  state: string;
  sandboxInstance: SandboxInstance;
  allocationRequest: AllocationRequest;
  cleanupRequest: CleanupRequest;

  constructor(allocationUnit: SandboxAllocationUnit, sandboxInstance: SandboxInstance) {
    this.id = allocationUnit.id;
    this.name = `Sandbox ${allocationUnit.id}`;
    this.createdAt = allocationUnit.allocationRequest.createdAt;
    this.createdBy = allocationUnit.createdBy.fullName;
    this.poolId = allocationUnit.poolId;
    this.sandboxInstance = sandboxInstance;
    this.allocationRequest = allocationUnit.allocationRequest;
    this.cleanupRequest = allocationUnit.cleanupRequest;
    this.state = this.stateResolver();
  }

  public allocationRunning(): boolean {
    return (
      this.allocationRequest.stages.some((stage) => stage != RequestStageState.FINISHED) && !this.allocationFailed()
    );
  }

  public cleanupRunning(): boolean {
    return (
      this.cleanupExists() &&
      !this.cleanupFailed() &&
      this.cleanupRequest.stages.some((stage) => stage != RequestStageState.FINISHED)
    );
  }

  public allocationFailed(): boolean {
    return this.allocationRequest.stages.some((stage) => stage == RequestStageState.FAILED);
  }

  public cleanupFailed(): boolean {
    return this.cleanupExists() && this.cleanupRequest.stages.some((stage) => stage == RequestStageState.FAILED);
  }

  public buildFinished(): boolean {
    return (
      this.allocationRequest.stages.every((stage) => stage === RequestStageState.FINISHED) && !this.cleanupRunning()
    );
  }

  private cleanupExists(): boolean {
    return this.cleanupRequest != null;
  }

  public stateResolver(): string {
    if (this.allocationRunning()) return AbstractSandboxState.AllocationRunning;
    if (this.cleanupRunning()) return AbstractSandboxState.CleanupRunning;
    if (this.allocationFailed()) return AbstractSandboxState.AllocationFailed;
    if (this.cleanupFailed()) return AbstractSandboxState.CleanupFailed;
    if (this.buildFinished()) return AbstractSandboxState.BuildFinished;
  }

  // states: allocation-running, cleanup-running, allocation-failed, cleanup-failed, built,
}
