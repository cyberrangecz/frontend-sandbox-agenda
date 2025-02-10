import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  SentinelNotification,
  SentinelNotificationResult,
  SentinelNotificationService,
  SentinelNotificationTypeEnum,
} from '@sentinel/layout/notification';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ClientErrorHandlerService {
  constructor(private notificationService: SentinelNotificationService) {}

  emit(err: HttpErrorResponse, operation: string, action?: string): Observable<boolean> {
    const notification: SentinelNotification = {
      type: SentinelNotificationTypeEnum.Error,
      title: operation,
      source: 'Sandbox Agenda',
    };
    if (action !== undefined) {
      notification.action = action;
    }
    if (err.error) {
      if (err.error.detail) {
        notification.additionalInfo = [err.error.detail];
      } else if (err.error.non_field_errors) {
        notification.additionalInfo = [err.error.non_field_errors];
      }
    }
    return this.notificationService
      .emit(notification)
      .pipe(map((result) => result === SentinelNotificationResult.CONFIRMED));
  }
}
