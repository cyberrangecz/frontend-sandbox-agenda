/**
 * Displays notifications from sandbox agenda services and components. Should be overridden by client
 */
export abstract class SandboxNotificationService {

  /**
   * Emits notification
   * @param type type of notification
   * @param message message of notification
   * @param duration optional duration of the notification
   */
  abstract emit(
    type: 'error' | 'warning' | 'info' | 'success',
    message: string,
    duration?: number): void;
}
