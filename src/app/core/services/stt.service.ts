import { Injectable, inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError, from } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class SttService {
  private http = inject(HttpClient);
  // private apiUrl = ... (Removed legacy URL)
  
  private genAI: GoogleGenAI;
  
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private recognition: any = null; // Web Speech API SpeechRecognition
  private ngZone = inject(NgZone);

  constructor() {
    this.genAI = new GoogleGenAI({
      apiKey: environment.googleCloudApiKey
    });
  }


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

  stopAndAnalyze(targetText: string, languageCode: string = 'en-US'): Observable<any> {
    return new Observable(observer => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        observer.error('Recorder not active');
        return;
      }

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.stopStream(); // Cleanup stream
        
        // Convert Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          try {
             const result = await this.analyzeWithGemini(base64Audio, targetText, languageCode);
             observer.next(result);
             observer.complete();
          } catch (err) {
             observer.error(err);
          }
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

  private async analyzeWithGemini(base64Audio: string, targetText: string, languageCode: string): Promise<any> {
      const prompt = `
        You are a friendly language tutor for kids.
        Analyze this audio recording of a child reading the following text: "${targetText}".
        The target language is "${languageCode}".

        Please provide:
        1. A pronunciation score (0-100).
        2. A very brief, encouraging feedback message (max 1 sentence).
        3. A list of words they mispronounced (if any).

        Return ONLY a JSON object:
        {
          "score": number,
          "feedback": "string",
          "mispronouncedWords": ["word1", "word2"]
        }
      `;

      const response = await this.genAI.models.generateContent({
        model: (environment as any).geminiModel || 'gemini-1.5-flash-001',
        contents: [
          { text: prompt },
          { inlineData: { data: base64Audio, mimeType: 'audio/webm' } }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              score: { type: 'NUMBER' },
              feedback: { type: 'STRING' },
              mispronouncedWords: { 
                type: 'ARRAY',
                items: { type: 'STRING' }
              }
            },
            required: ['score', 'feedback', 'mispronouncedWords']
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error('No assessment generated');
      return JSON.parse(text);
  }
}
