import { KypoTopologyGraphConfig } from '@muni-kypo-crp/topology-graph';
export class SandboxAgendaConfig {
  pollingPeriod: number;
  retryAttempts: number;
  defaultPaginationSize: number;
  kypoTopologyConfig: KypoTopologyGraphConfig;
}
