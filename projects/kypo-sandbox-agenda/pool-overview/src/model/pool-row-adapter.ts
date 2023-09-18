import { Pool } from '@muni-kypo-crp/sandbox-model';

export class PoolRowAdapter extends Pool {
  title: string;
  createdByName: string;
  instancesUtilization: string;
  cpuUtilization: string;
  ramUtilization: string;
  sandboxDefinitionName: string;
}
