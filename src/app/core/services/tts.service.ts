import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TtsResponse, Timepoint } from '../models/tts-response.model';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private http = inject(HttpClient);
  // Use v1beta1 for timepoints support
  private apiUrl = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${environment.googleCloudApiKey}`;

  speak(text: string, languageCode: string = 'en-US', speed: number = 1.0): Observable<{ audio: HTMLAudioElement, timepoints: Timepoint[] }> {
    // Generate SSML with marks for each word
    // We treat newlines as separate semantic blocks if ensuring pauses, 
    // but for simple word tracking, we split by space.
    const words = text.split(/\s+/);
    let ssml = '<speak>';
    words.forEach((word, index) => {
      // Escape special characters in word if necessary, though simple text is usually safe
      ssml += `<mark name="word_${index}"/>${word} `;
    });
    ssml += '</speak>';

    const payload = {
      input: { ssml },
      voice: { languageCode: languageCode, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3', speakingRate: speed },
      enableTimePointing: ['SSML_MARK']
    };

    return this.http.post<TtsResponse>(this.apiUrl, payload).pipe(
      map(response => {
        const audioContent = response.audioContent;
        // Create audio element from base64 content
        const audio = new Audio('data:audio/mp3;base64,' + audioContent);
        // Map timepoints if they exist
        const timepoints = response.timepoints || [];
        return { 
          audio, 
          timepoints
        };
      })
    );
  }
}
