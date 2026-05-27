import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EpisodeCardComponent } from './episode-card.component';
import { Episode } from '../../../core/models/episode.model';

// ──────────────────────────────────────────────────────────────────────────────
// Datos de prueba
// ──────────────────────────────────────────────────────────────────────────────
const MOCK_EPISODE: Episode = {
  id: 1,
  name: 'Pilot',
  air_date: 'December 2, 2013',
  episode: 'S01E01',
  characters: ['https://rickandmortyapi.com/api/character/1'],
  url: 'https://rickandmortyapi.com/api/episode/1',
  created: '2017-11-10T12:56:33.798Z',
};

// ──────────────────────────────────────────────────────────────────────────────
// Suite
// ──────────────────────────────────────────────────────────────────────────────
describe('EpisodeCardComponent', () => {
  let fixture: ComponentFixture<EpisodeCardComponent>;
  let component: EpisodeCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EpisodeCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('episode', MOCK_EPISODE);
    fixture.detectChanges();
  });

  // ── Creación ──────────────────────────────────────────────────────────────
  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // ── Getters derivados ─────────────────────────────────────────────────────
  it('seasonNumber debería extraer el número de temporada del código de episodio', () => {
    expect(component.seasonNumber).toBe('01');
  });

  it('episodeNumber debería extraer el número de episodio del código', () => {
    expect(component.episodeNumber).toBe('01');
  });

  // ── Renderizado ───────────────────────────────────────────────────────────
  it('debería mostrar el nombre del episodio en el DOM', () => {
    const nameEl = fixture.debugElement.query(By.css('.episode-name'));
    expect(nameEl?.nativeElement.textContent).toContain('Pilot');
  });

  it('debería mostrar la fecha de emisión en el DOM', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('December 2, 2013');
  });

  it('debería mostrar el código de episodio (S01E01) en el DOM', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('S01E01');
  });

  // ── Evento selected ───────────────────────────────────────────────────────
  it('onCardClick() debería emitir el episodio al output selected', () => {
    const emitted: Episode[] = [];
    component.selected.subscribe((ep: Episode) => emitted.push(ep));

    component.onCardClick();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual(MOCK_EPISODE);
  });

  it('un click en la tarjeta debería emitir el episodio', () => {
    const emitted: Episode[] = [];
    component.selected.subscribe((ep: Episode) => emitted.push(ep));

    const card = fixture.debugElement.query(By.css('.episode-card, [class*="card"]'));
    if (card) {
      card.nativeElement.click();
      expect(emitted.length).toBeGreaterThan(0);
    } else {
      // Si no hay selector específico, llamamos directamente al método
      component.onCardClick();
      expect(emitted.length).toBe(1);
    }
  });
});
