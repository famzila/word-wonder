import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, from } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GeminiService } from './gemini.service';

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private http = inject(HttpClient);
  private geminiService = inject(GeminiService);
  private apiUrl = (environment as any).imageApiUrl || 'https://api.pexels.com/v1/search';

  searchImage(query: string): Observable<string | null> {
    if (!query) return of(null);

    const provider = (environment as any).imageProvider || 'pexels';

    if (provider === 'gemini') {
        return from(this.geminiService.generateImage(query));
    }

    // Pexels Implementation
    // Casting environment to any to access pexelAPI since it's not in the strict type yet
    const apiKey = (environment as any).pexelAPI;
    
    if (!apiKey || apiKey === 'YOUR_PEXEL_API_KEY_HERE') {
      console.warn('Pexels API key missing or invalid');
      return of(null);
    }

    const headers = new HttpHeaders({
      'Authorization': apiKey
    });

    return this.http.get<PexelsResponse>(`${this.apiUrl}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, { headers }).pipe(
      map(response => {
        if (response.photos && response.photos.length > 0) {
          // Use medium size for better performance but good quality
          return response.photos[0].src.medium;
        }
        return null;
      }),
      catchError(err => {
        console.error('Pexels API Error:', err);
        return of(null);
      })
    );
  }
}
