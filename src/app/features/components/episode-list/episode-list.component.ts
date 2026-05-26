import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EpisodeStateService } from '../../services/episode-state.service';
import { EpisodeCardComponent } from '../episode-card/episode-card.component';
import { EpisodeFiltersComponent } from '../episode-filters/episode-filters.component';
import { EpisodeDetailComponent } from '../episode-detail/episode-detail.component';
import { LoadingSpinnerComponent } from '../../../shared/component/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../shared/component/error-banner/error-banner.component';
import { PaginationComponent } from '../../../shared/component/pagination/pagination.component';
import { Episode } from '../../../core/models/episode.model';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [
    CommonModule,
    EpisodeCardComponent,
    EpisodeFiltersComponent,
    LoadingSpinnerComponent,
    ErrorBannerComponent,
    PaginationComponent,
  ],
  templateUrl: './episode-list.component.html',
  styleUrls: ['./episode-list.component.scss'],
})
export class EpisodeListComponent implements OnInit {
  private readonly state = inject(EpisodeStateService);
  private readonly dialog = inject(MatDialog);

  get episodes() { return this.state.episodes(); }
  get loading() { return this.state.loading(); }
  get error() { return this.state.error(); }
  get currentPage() { return this.state.currentPage(); }
  get totalPages() { return this.state.totalPages(); }
  get hasActiveFilters() { return this.state.hasActiveFilters(); }

  get isEmpty(): boolean {
    return !this.loading && !this.error && this.episodes.length === 0;
  }

  ngOnInit(): void {
    this.state.loadEpisodes();
  }

  onEpisodeSelected(episode: Episode): void {
    this.dialog.open(EpisodeDetailComponent, {
      data: episode,
      maxWidth: '760px',
      width: '100%',
      panelClass: 'episode-dialog',
    });
  }

  onPageChanged(page: number): void {
    this.state.setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onErrorDismissed(): void {
    this.state.clearError();
  }
}
