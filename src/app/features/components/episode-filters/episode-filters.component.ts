import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EpisodeStateService } from '../../services/episode-state.service';

interface SeasonOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-episode-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './episode-filters.component.html',
  styleUrls: ['./episode-filters.component.scss'],
})
export class EpisodeFiltersComponent implements OnInit {
  private readonly state = inject(EpisodeStateService);
  private readonly fb = inject(FormBuilder);

  filtersForm!: FormGroup;
  showFilters = signal(false);

  readonly seasons: SeasonOption[] = [
    { label: 'Todas las temporadas', value: '' },
    { label: 'Temporada 1', value: 'S01' },
    { label: 'Temporada 2', value: 'S02' },
    { label: 'Temporada 3', value: 'S03' },
    { label: 'Temporada 4', value: 'S04' },
    { label: 'Temporada 5', value: 'S05' },
  ];

  get totalCount(): number {
    return this.state.totalCount();
  }

  get hasActiveFilters(): boolean {
    return this.state.hasActiveFilters();
  }

  ngOnInit(): void {
    this.filtersForm = this.fb.group({ name: [''], episode: [''] });

    this.filtersForm.get('name')!.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((name: string) => {
      this.state.setFilters({ ...this.filtersForm.value, name });
    });

    this.filtersForm.get('episode')!.valueChanges.subscribe((episode: string) => {
      this.state.setFilters({ ...this.filtersForm.value, episode: episode ?? '' });
    });
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  resetFilters(): void {
    // { emitEvent: false } evita que valueChanges dispare setFilters()
    // antes de que state.resetFilters() haga su propia carga,
    // eliminando la doble petición redundante.
    this.filtersForm.reset({ name: '', episode: '' }, { emitEvent: false });
    this.state.resetFilters();
  }
}
