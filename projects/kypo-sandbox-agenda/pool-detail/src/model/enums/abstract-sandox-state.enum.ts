export enum AbstractSandboxState {
  AllocationRunning = 'allocation running',
  CleanupRunning = 'cleanup running',
  AllocationFailed = 'allocation failed',
  CleanupFailed = 'cleanup running',
  BuildFinished = 'build finished',
}
