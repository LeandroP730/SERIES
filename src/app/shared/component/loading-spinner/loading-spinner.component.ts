import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="spinner-wrapper">
      <mat-spinner [diameter]="diameter()" color="accent" />
      @if (message()) {
        <p class="message">{{ message() }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 40px;
    }
    .message { color: #94a3b8; font-size: 0.9rem; margin: 0; }
  `],
})
export class LoadingSpinnerComponent {
  diameter = input<number>(48);
  message = input<string>('');
}
