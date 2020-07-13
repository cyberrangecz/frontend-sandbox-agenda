import {
  NetworkingAnsibleAllocationStage,
  NetworkingAnsibleCleanupStage,
  OpenStackAllocationStage,
  OpenStackCleanupStage,
  UserAnsibleAllocationStage,
  UserAnsibleCleanupStage,
} from 'kypo-sandbox-model';

export type AnsibleAllocationStage = NetworkingAnsibleAllocationStage | UserAnsibleAllocationStage;
export type AnsibleCleanupStage = NetworkingAnsibleCleanupStage | UserAnsibleCleanupStage;
export type AnsibleStage = AnsibleAllocationStage | AnsibleCleanupStage;
export type OpenStackStage = OpenStackAllocationStage | OpenStackCleanupStage;
