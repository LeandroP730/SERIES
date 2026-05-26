import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/character`;

  getCharactersByUrls(urls: string[]): Observable<Character[]> {
    const ids = urls.map((url) => url.split('/').pop()).join(',');
    return this.http.get<Character[]>(`${this.baseUrl}/${ids}`);
  }
}
