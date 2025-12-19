Example stt service

```typescript
import { Injectable, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SttService {
  private recognition: any;
  private isListening = false;
  private ngZone = inject(NgZone);

  listen(languageCode: string = 'en-US'): Observable<string> {
    return new Observable(observer => {
      if (!('webkitSpeechRecognition' in window)) {
        observer.error('Web Speech API not supported');
        return;
      }

      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = languageCode;

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          } else {
            transcript += event.results[i][0].transcript;
          }
        }
        
        // Run inside NgZone to ensure view updates
        this.ngZone.run(() => {
          observer.next(transcript);
        });
      };

      this.recognition.onerror = (event: any) => {
        this.ngZone.run(() => {
          observer.error(event.error);
        });
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.ngZone.run(() => {
          observer.complete();
        });
      };

      this.isListening = true;
      this.recognition.start();

      // Cleanup function
      return () => {
        this.stop();
      };
    });
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
```