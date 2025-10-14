import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent {
  @Input() type: AlertType = 'info';
  @Input() message = '';
  @Input() dismissible = true;
  @Input() autoClose = false;
  @Input() autoCloseDelay = 5000;
  @Output() dismissed = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.autoClose) {
      setTimeout(() => {
        this.dismiss();
      }, this.autoCloseDelay);
    }
  }

  dismiss(): void {
    this.dismissed.emit();
  }

  getIcon(): string {
    switch (this.type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
      default:
        return 'fas fa-info-circle';
    }
  }
}
