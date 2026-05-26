import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EpisodeStateService } from '../../services/episode-state.service';
import { Episode } from '../../../core/models/episode.model';
import { LoadingSpinnerComponent } from '../../../shared/component/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './episode-detail.component.html',
  styleUrls: ['./episode-detail.component.scss'],
})
export class EpisodeDetailComponent implements OnInit {
  private readonly state = inject(EpisodeStateService);
  readonly dialogRef = inject(MatDialogRef<EpisodeDetailComponent>);
  readonly episode = inject(MAT_DIALOG_DATA) as Episode;

  get characters() { return this.state.characters(); }
  get charactersLoading() { return this.state.charactersLoading(); }

  get seasonNumber(): string { return this.episode.episode.substring(1, 3); }
  get episodeNumber(): string { return this.episode.episode.substring(4, 6); }

  ngOnInit(): void {
    this.state.loadCharacters(this.episode.characters);
  }

  close(): void {
    this.state.clearCharacters();
    this.dialogRef.close();
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      Alive: '#4ade80',
      Dead: '#f87171',
      unknown: '#94a3b8',
    };
    return map[status] ?? '#94a3b8';
  }
}
