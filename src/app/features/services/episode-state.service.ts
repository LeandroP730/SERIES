import { Injectable, inject, signal, computed } from '@angular/core';
import { Subject, switchMap, catchError, of, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EpisodeService } from '../../core/services/episode.service';
import { CharacterService } from '../../core/services/character.service';
import { Episode } from '../../core/models/episode.model';
import { Character } from '../../core/models/character.model';
import { EpisodeFilters } from '../../core/interfaces/episode.interface';

interface LoadRequest {
  page: number;
  filters: EpisodeFilters;
}

@Injectable({
  providedIn: 'root',
})
export class EpisodeStateService {
  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);

  readonly episodes        = signal<Episode[]>([]);
  readonly loading         = signal<boolean>(false);
  readonly error           = signal<string | null>(null);
  readonly currentPage     = signal<number>(1);
  readonly totalPages      = signal<number>(0);
  readonly totalCount      = signal<number>(0);
  readonly filters         = signal<EpisodeFilters>({ name: '', episode: '' });
  readonly characters      = signal<Character[]>([]);
  readonly charactersLoading = signal<boolean>(false);

  readonly hasActiveFilters = computed(() => {
    const f = this.filters();
    return f.name.trim().length > 0 || f.episode.trim().length > 0;
  });

  private readonly loadTrigger$ = new Subject<LoadRequest>();

  constructor() {
    this.loadTrigger$
      .pipe(
        switchMap(({ page, filters }) => {
          this.loading.set(true);
          this.error.set(null);

          return this.episodeService.getEpisodes(page, filters).pipe(
            map((response) => ({ response, page })),
            catchError((err: Error) => {
              this.error.set(err.message ?? 'Ocurrió un error inesperado.');
              this.episodes.set([]);
              this.loading.set(false);
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        if (!result) return; 

        const { response, page } = result;
        this.episodes.set(response.results);
        this.totalPages.set(response.info.pages);
        this.totalCount.set(response.info.count);
        this.currentPage.set(page);
        this.loading.set(false);
      });
  }

  loadEpisodes(page = 1, filters: EpisodeFilters = { name: '', episode: '' }): void {
    this.loadTrigger$.next({ page, filters });
  }

  setFilters(filters: EpisodeFilters): void {
    this.filters.set(filters);
    this.loadEpisodes(1, filters);
  }

  setPage(page: number): void {
    this.loadEpisodes(page, this.filters());
  }

  resetFilters(): void {
    const empty: EpisodeFilters = { name: '', episode: '' };
    this.filters.set(empty);
    this.loadEpisodes(1, empty);
  }

  loadCharacters(urls: string[]): void {
    if (!urls.length) return;

    this.charactersLoading.set(true);
    const limitedUrls = urls.slice(0, 12);

    this.characterService.getCharactersByUrls(limitedUrls).subscribe({
      next: (characters) => {
        this.characters.set(Array.isArray(characters) ? characters : [characters]);
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
