example tts service

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
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
    const words = text.split(/\s+/);
    let ssml = '<speak>';
    words.forEach((word, index) => {
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
        const audio = new Audio('data:audio/mp3;base64,' + audioContent);
        this.lastTimepoints = response.timepoints || [];
        return { 
          audio, 
          timepoints: this.lastTimepoints
        };
      })
    );
  }

  lastTimepoints: Timepoint[] = [];
}

```