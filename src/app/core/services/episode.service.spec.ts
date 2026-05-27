import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { EpisodeService } from './episode.service';
import { EpisodeApiResponse } from '../interfaces/episode.interface';
import { environment } from '../../../environments/environment';

const MOCK_RESPONSE: EpisodeApiResponse = {
  info: { count: 51, pages: 3, next: 'https://...', prev: null },
  results: [
    {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: ['https://rickandmortyapi.com/api/character/1'],
      url: 'https://rickandmortyapi.com/api/episode/1',
      created: '2017-11-10T12:56:33.798Z',
    },
  ],
};


describe('EpisodeService', () => {
  let service: EpisodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), EpisodeService],
    });
    service  = TestBed.inject(EpisodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getEpisodes() debería realizar GET a la URL correcta con parámetro de página', () => {
    service.getEpisodes(2, { name: '', episode: '' }).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.apiUrl}/episode` && r.params.get('page') === '2',
    );
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_RESPONSE);
  });

  it('getEpisodes() debería añadir el parámetro name cuando tiene valor', () => {
    service.getEpisodes(1, { name: 'Pilot', episode: '' }).subscribe();

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${environment.apiUrl}/episode` &&
        r.params.get('name') === 'Pilot',
    );
    req.flush(MOCK_RESPONSE);
  });

  it('getEpisodes() debería añadir el parámetro episode cuando tiene valor', () => {
    service.getEpisodes(1, { name: '', episode: 'S01' }).subscribe();

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${environment.apiUrl}/episode` &&
        r.params.get('episode') === 'S01',
    );
    req.flush(MOCK_RESPONSE);
  });

  it('getEpisodes() debería emitir la respuesta correctamente', () => {
    let result: EpisodeApiResponse | undefined;

    service.getEpisodes(1, { name: '', episode: '' }).subscribe((r) => (result = r));

    httpMock
      .expectOne(`${environment.apiUrl}/episode?page=1`)
      .flush(MOCK_RESPONSE);

    expect(result).toEqual(MOCK_RESPONSE);
    expect(result?.results[0].name).toBe('Pilot');
  });

  it('getEpisodes() NO debería incluir name cuando está vacío', () => {
    service.getEpisodes(1, { name: '   ', episode: '' }).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.apiUrl}/episode`,
    );
    expect(req.request.params.has('name')).toBe(false);
    req.flush(MOCK_RESPONSE);
  });
});
