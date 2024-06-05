import { Pool, Resources } from '@muni-kypo-crp/sandbox-model';

export class PoolRowAdapter extends Pool {
  title: string;
  createdByName: string;
  comment: string;
  resourcesUtilization: string;
  instancesUtilization: number;
  vcpuUtilization: number;
  ramUtilization: number;
  networkUtilization: number;
  portUtilization: number;
  sandboxDefinitionNameAndRevision: string;
  resources?: Resources;
}
