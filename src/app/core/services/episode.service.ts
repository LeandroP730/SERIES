import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { EpisodeApiResponse, EpisodeFilters } from "../interfaces/episode.interface";

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/episode`;

  getEpisodes(page: number, filters: EpisodeFilters): Observable<EpisodeApiResponse> {

    let params = new HttpParams()
      .set('page', page.toString());

    if (filters.name?.trim()) {
      params = params.set('name', filters.name.trim());
    }

    if (filters.episode?.trim()) {
      params = params.set('episode', filters.episode.trim());
    }

    return this.http.get<EpisodeApiResponse>(this.baseUrl, { params });
  }
}