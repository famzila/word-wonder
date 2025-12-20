import { Injectable } from '@angular/core';
import { Observable, from, map, switchMap } from 'rxjs';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';

interface OcrResult {
  text: string;
  languageCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private genAI: GoogleGenAI;

  constructor() {
    this.genAI = new GoogleGenAI({
      apiKey: environment.googleCloudApiKey
    });
  }

  extractText(file: File): Observable<OcrResult> {
    return this.convertFileToBase64(file).pipe(
      switchMap(base64Image => {
        return from(this.processWithGemini(base64Image, file.type));
      })
    );
  }

  private async processWithGemini(base64Image: string, mimeType: string): Promise<OcrResult> {
    try {
      const prompt = `
        Analyze this image and extract all readable text exactly as it appears.
        CRITICAL RULES:
        1. Preserve all original spaces, line breaks, and paragraph structure. 
        2. Do NOT merge separate written lines into a single word (e.g. "Title" and "Subtitle" should be separated by a newline).
        3. Determine the primary language.
        
        Return ONLY a JSON object with this structure:
        {
          "text": "The extracted text with original formatting preserved",
          "languageCode": "The BCP-47 language code"
        }
      `;

      const response = await this.genAI.models.generateContent({
        model: (environment as any).geminiModel || 'gemini-1.5-flash-001',
        contents: [
          { text: prompt },
          { inlineData: { data: base64Image, mimeType: mimeType } }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              text: { type: 'STRING' },
              languageCode: { type: 'STRING' }
            },
            required: ['text', 'languageCode']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from Gemini');
      }

      return JSON.parse(responseText) as OcrResult;

    } catch (error) {
      console.error('OCR Gemini Error:', error);
      return { 
        text: 'Could not extract text from image.', 
        languageCode: 'en-US' 
      };
    }
  }

  private convertFileToBase64(file: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the "data:image/jpeg;base64," part
        const base64 = result.split(',')[1];
        observer.next(base64);
        observer.complete();
      };
      reader.onerror = error => observer.error(error);
    });
  }
}
