import { Injectable, inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError, from } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SttService {
  private http = inject(HttpClient);
  private apiUrl = `https://speech.googleapis.com/v1/speech:recognize?key=${environment.googleCloudApiKey}`;
  
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private recognition: any = null; // Web Speech API SpeechRecognition
  private ngZone = inject(NgZone);


  async startRecording(): Promise<void> {
    this.audioChunks = [];
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  /**
   * Start real-time speech recognition using Web Speech API
   * Returns an Observable that emits interim and final results
   */
  startRealtimeRecognition(languageCode: string = 'en-US'): Observable<{ transcript: string; isFinal: boolean; words: string[] }> {
    return new Observable(observer => {
      // Check for Web Speech API support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        observer.error('Web Speech API not supported in this browser');
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = languageCode;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        // Iterate from 0 to reconstruct the full transcript every time
        // This ensures we don't lose history or cause alignment jumps
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
             finalTranscript += transcript;
          } else {
             interimTranscript += transcript;
          }
        }

        const fullTranscript = (finalTranscript + interimTranscript).trim();
        const words = fullTranscript.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        
        this.ngZone.run(() => {
          observer.next({
            transcript: fullTranscript,
            isFinal: finalTranscript.length > 0,
            words: words
          });
        });
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.ngZone.run(() => {
          observer.error(event.error);
        });
      };

      this.recognition.onend = () => {
        this.ngZone.run(() => {
          observer.complete();
        });
      };

      this.recognition.start();

      // Return cleanup function
      return () => {
        if (this.recognition) {
          this.recognition.stop();
          this.recognition = null;
        }
      };
    });
  }

  stopRealtimeRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }

  stopAndAnalyze(languageCode: string = 'en-US'): Observable<string> {
    return new Observable<string>(observer => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        observer.error('Recorder not active');
        return;
      }

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' }); // Chrome records in webm by default
        this.stopStream(); // Cleanup stream
        
        // Convert Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          this.analyzeAudio(base64Audio, languageCode).subscribe({
            next: (transcript) => {
              observer.next(transcript);
              observer.complete();
            },
            error: (err) => observer.error(err)
          });
        };
        reader.onerror = (err) => observer.error(err);
      };

      this.mediaRecorder.stop();
    });
  }

  private stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  private analyzeAudio(base64Audio: string, languageCode: string): Observable<string> {
    const payload = {
      config: {
        languageCode: languageCode,
        encoding: 'WEBM_OPUS', // Standard for web audio recording in Chrome/Firefox
        sampleRateHertz: 48000, // Typical default, but might need adjustment based on browser
        // enableAutomaticPunctuation: true
      },
      audio: {
        content: base64Audio
      }
    };

    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(response => {
        if (response.results && response.results.length > 0) {
          // Join all alternatives or just take the first result's first alternative
          return response.results[0].alternatives[0].transcript;
        }
        return '';
      }),
      catchError(error => {
        console.error('STT API Error:', error);
        return throwError(() => error);
      })
    );
  }
}
