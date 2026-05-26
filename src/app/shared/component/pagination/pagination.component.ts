import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <nav class="pagination">
      <button mat-icon-button [disabled]="currentPage() === 1" (click)="goTo(currentPage() - 1)">
        <mat-icon>chevron_left</mat-icon>
      </button>

      @for (page of visiblePages(); track $index) {
        @if (isNumber(page)) {
          <button mat-button class="page-btn" [class.active]="page === currentPage()" (click)="goTo(page)">
            {{ page }}
          </button>
        } @else {
          <span class="ellipsis">…</span>
        }
      }

      <button mat-icon-button [disabled]="currentPage() === totalPages()" (click)="goTo(currentPage() + 1)">
        <mat-icon>chevron_right</mat-icon>
      </button>
    </nav>
  `,
  styles: [`
    .pagination { display: flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: wrap; }
    .page-btn { min-width: 40px; height: 40px; border-radius: 8px; color: #94a3b8; }
    .page-btn.active { background: #6366f1; color: #fff; pointer-events: none; }
    .ellipsis { width: 32px; text-align: center; color: #475569; line-height: 40px; }
  `],
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChanged = output<number>();

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: (number | '...')[] = [];
    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    pages.push(1);
    const left = Math.max(2, current - 2);
    const right = Math.min(total - 1, current + 2);
    if (left > 2) pages.push('...');
    range(left, right).forEach((p) => pages.push(p));
    if (right < total - 1) pages.push('...');
    if (total > 1) pages.push(total);
    return pages;
  });

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChanged.emit(page);
    }
  }

  isNumber(value: number | '...'): value is number {
    return typeof value === 'number';
  }
}
