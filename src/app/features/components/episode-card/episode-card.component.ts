import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Episode } from '../../../core/models/episode.model';

@Component({
  selector: 'app-episode-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './episode-card.component.html',
  styleUrls: ['./episode-card.component.scss'],
})
export class EpisodeCardComponent {
  episode = input.required<Episode>();
  selected = output<Episode>();

  get seasonNumber(): string {
    return this.episode().episode.substring(1, 3);
  }

  get episodeNumber(): string {
    return this.episode().episode.substring(4, 6);
  }

  onCardClick(): void {
    this.selected.emit(this.episode());
  }
}