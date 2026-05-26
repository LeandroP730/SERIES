import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    @if (message()) {
      <div class="error-banner">
        <mat-icon>error_outline</mat-icon>
        <span>{{ message() }}</span>
        <button mat-icon-button (click)="dismissed.emit()" aria-label="Cerrar">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    }
  `,
  styles: [`
    .error-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 10px;
      color: #fca5a5;

      mat-icon:first-child { color: #ef4444; flex-shrink: 0; }
      span { flex: 1; font-size: 0.9rem; }
      button { color: #fca5a5; flex-shrink: 0; }
    }
  `],
})
export class ErrorBannerComponent {
  message = input.required<string | null>();
  dismissed = output<void>();
}
