import { Component } from '@angular/core';
import { EpisodeListComponent } from '../components/episode-list/episode-list.component';

@Component({
  selector: 'app-episodes-page',
  standalone: true,
  imports: [EpisodeListComponent],
  template: `
    <div class="page">
      <header class="page-header">
        <div class="header-inner">
          <span class="logo">🛸</span>
          <div>
            <h1>Rick & Morty</h1>
            <p>Explorador de Episodios</p>
          </div>
        </div>
      </header>

      <main class="page-main">
        <app-episode-list />
      </main>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: #060b14; }

    .page-header {
      background: rgba(10,15,28,0.95);
      border-bottom: 1px solid #0f172a;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
    }

    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo { font-size: 2rem; }

    h1 { margin: 0; font-size: 1.4rem; font-weight: 800; color: #f1f5f9; }
    p { margin: 0; font-size: 0.75rem; color: #6366f1; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }

    .page-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 64px;

      @media (max-width: 600px) { padding: 20px 16px 48px; }
    }
  `],
})
export class EpisodesPageComponent {}
