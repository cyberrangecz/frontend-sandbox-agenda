import { RequestStageType } from '@kypo/sandbox-model';

export const OPENSTACK_STAGE_TYPES = [RequestStageType.OPEN_STACK_ALLOCATION, RequestStageType.OPEN_STACK_CLEANUP];
export const ANSIBLE_STAGE_TYPES = [
  RequestStageType.NETWORKING_ANSIBLE_ALLOCATION,
  RequestStageType.NETWORKING_ANSIBLE_CLEANUP,
  RequestStageType.USER_ANSIBLE_ALLOCATION,
  RequestStageType.USER_ANSIBLE_CLEANUP,
];

export const ANSIBLE_NETWORKING_TYPES = [
  RequestStageType.NETWORKING_ANSIBLE_ALLOCATION,
  RequestStageType.NETWORKING_ANSIBLE_CLEANUP,
];

export const ANSIBLE_USER_TYPES = [RequestStageType.USER_ANSIBLE_ALLOCATION, RequestStageType.USER_ANSIBLE_CLEANUP];
