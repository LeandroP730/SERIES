import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { EpisodeStateService } from './episode-state.service';
import { EpisodeService } from '../../core/services/episode.service';
import { CharacterService } from '../../core/services/character.service';
import { EpisodeApiResponse } from '../../core/interfaces/episode.interface';
import { Character } from '../../core/models/character.model';

// ──────────────────────────────────────────────────────────────────────────────
// Datos de prueba
// ──────────────────────────────────────────────────────────────────────────────
const MOCK_RESPONSE: EpisodeApiResponse = {
  info: { count: 20, pages: 1, next: null, prev: null },
  results: [
    {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: ['https://rickandmortyapi.com/api/character/1'],
      url: '',
      created: '',
    },
  ],
};

const MOCK_CHARACTERS: Character[] = [
  { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: '' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Suite
// Los mocks usan of() (Observable síncrono), por lo que el Subject + switchMap
// también procesa de forma síncrona: no se necesita fakeAsync ni tick().
// ──────────────────────────────────────────────────────────────────────────────
describe('EpisodeStateService', () => {
  let service: EpisodeStateService;
  let episodeSpy: { getEpisodes: ReturnType<typeof vi.fn> };
  let characterSpy: { getCharactersByUrls: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    episodeSpy   = { getEpisodes: vi.fn().mockReturnValue(of(MOCK_RESPONSE)) };
    characterSpy = { getCharactersByUrls: vi.fn().mockReturnValue(of(MOCK_CHARACTERS)) };

    TestBed.configureTestingModule({
      providers: [
        EpisodeStateService,
        { provide: EpisodeService,   useValue: episodeSpy },
        { provide: CharacterService, useValue: characterSpy },
      ],
    });

    service = TestBed.inject(EpisodeStateService);
  });

  // ── Creación ──────────────────────────────────────────────────────────────
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── loadEpisodes ──────────────────────────────────────────────────────────
  it('loadEpisodes() debería actualizar episodes, totalPages y currentPage', () => {
    service.loadEpisodes(1, { name: '', episode: '' });

    // of() es síncrono → los signals ya están actualizados aquí
    expect(service.episodes()).toEqual(MOCK_RESPONSE.results);
    expect(service.totalPages()).toBe(1);
    expect(service.currentPage()).toBe(1);
    expect(service.loading()).toBe(false);
  });

  it('loadEpisodes() debería establecer error cuando el servicio falla', () => {
    episodeSpy.getEpisodes.mockReturnValue(
      throwError(() => new Error('Error interno del servidor. Intenta más tarde.')),
    );

    service.loadEpisodes();

    expect(service.error()).toBe('Error interno del servidor. Intenta más tarde.');
    expect(service.episodes()).toEqual([]);
    expect(service.loading()).toBe(false);
  });

  // ── setFilters ────────────────────────────────────────────────────────────
  it('setFilters() debería actualizar la señal filters y disparar loadEpisodes()', () => {
    const filters = { name: 'Pilot', episode: '' };
    service.setFilters(filters);

    expect(service.filters()).toEqual(filters);
    expect(episodeSpy.getEpisodes).toHaveBeenCalledWith(1, filters);
  });

  // ── resetFilters ──────────────────────────────────────────────────────────
  it('resetFilters() debería limpiar filters y volver a la página 1', () => {
    service.setFilters({ name: 'Morty', episode: 'S02' });
    service.resetFilters();

    expect(service.filters()).toEqual({ name: '', episode: '' });
    expect(service.currentPage()).toBe(1);
    expect(service.hasActiveFilters()).toBe(false);
  });

  // ── hasActiveFilters ──────────────────────────────────────────────────────
  it('hasActiveFilters() debería ser true cuando hay filtros activos', () => {
    service.setFilters({ name: 'Pilot', episode: '' });
    expect(service.hasActiveFilters()).toBe(true);
  });

  it('hasActiveFilters() debería ser false cuando los filtros están vacíos', () => {
    expect(service.hasActiveFilters()).toBe(false);
  });

  // ── loadCharacters ────────────────────────────────────────────────────────
  it('loadCharacters() debería poblar la señal characters', () => {
    service.loadCharacters(['https://rickandmortyapi.com/api/character/1']);

    expect(service.characters()).toEqual(MOCK_CHARACTERS);
    expect(service.charactersLoading()).toBe(false);
  });

  it('loadCharacters() no debería llamar al servicio si la lista está vacía', () => {
    service.loadCharacters([]);
    expect(characterSpy.getCharactersByUrls).not.toHaveBeenCalled();
  });

  // ── clearError ────────────────────────────────────────────────────────────
  it('clearError() debería eliminar el mensaje de error', () => {
    episodeSpy.getEpisodes.mockReturnValue(
      throwError(() => new Error('Error de red')),
    );
    service.loadEpisodes();

    expect(service.error()).not.toBeNull();
    service.clearError();
    expect(service.error()).toBeNull();
  });

  // ── setPage ───────────────────────────────────────────────────────────────
  it('setPage() debería llamar a loadEpisodes con la página indicada y los filtros actuales', () => {
    service.setFilters({ name: 'Rick', episode: '' });
    episodeSpy.getEpisodes.mockClear();

    service.setPage(3);

    expect(episodeSpy.getEpisodes).toHaveBeenCalledWith(3, { name: 'Rick', episode: '' });
  });
});
