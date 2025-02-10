import { TopologyGraphConfig } from '@cyberrangecz-platform/topology-graph';

export class SandboxAgendaConfig {
  pollingPeriod: number;
  retryAttempts: number;
  defaultPaginationSize: number;
  topologyConfig: TopologyGraphConfig;
}
