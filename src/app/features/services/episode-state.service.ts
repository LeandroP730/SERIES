import { Injectable, inject, signal, computed } from '@angular/core';
import { EpisodeService } from '../../core/services/episode.service';
import { Episode } from '../../core/models/episode.model';
import { CharacterService } from '../../core/services/character.service';
import { EpisodeFilters } from '../../core/interfaces/episode.interface';
import { Character } from '../../core/models/character.model';

@Injectable({
  providedIn: 'root',
})
export class EpisodeStateService {
  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);

  readonly episodes = signal<Episode[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal<number>(1);
  readonly totalPages = signal<number>(0);
  readonly totalCount = signal<number>(0);
  readonly filters = signal<EpisodeFilters>({ name: '', episode: '' });
  readonly characters = signal<Character[]>([]);
  readonly charactersLoading = signal<boolean>(false);

  readonly hasActiveFilters = computed(() => {
    const f = this.filters();
    return f.name.trim().length > 0 || f.episode.trim().length > 0;
  });

  loadEpisodes(page: number = 1, filters: EpisodeFilters = { name: '', episode: '' }): void {
    this.loading.set(true);
    this.error.set(null);

    this.episodeService.getEpisodes(page, filters).subscribe({
      next: (response) => {
        this.episodes.set(response.results);
        this.totalPages.set(response.info.pages);
        this.totalCount.set(response.info.count);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.episodes.set([]);
        this.loading.set(false);
      },
    });
  }

  setFilters(filters: EpisodeFilters): void {
    this.filters.set(filters);
    this.loadEpisodes(1, filters);
  }

  setPage(page: number): void {
    this.loadEpisodes(page, this.filters());
  }

  resetFilters(): void {
    this.filters.set({ name: '', episode: '' });
    this.loadEpisodes(1, { name: '', episode: '' });
  }

  loadCharacters(urls: string[]): void {
    if (!urls.length) return;

    this.charactersLoading.set(true);
    const limitedUrls = urls.slice(0, 12);

    this.characterService.getCharactersByUrls(limitedUrls).subscribe({
      next: (characters) => {
        const asArray = Array.isArray(characters) ? characters : [characters];
        this.characters.set(asArray);
        this.charactersLoading.set(false);
      },
      error: () => {
        this.characters.set([]);
        this.charactersLoading.set(false);
      },
    });
  }

  clearCharacters(): void {
    this.characters.set([]);
  }

  clearError(): void {
    this.error.set(null);
  }
}
