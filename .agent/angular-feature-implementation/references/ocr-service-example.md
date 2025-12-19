Example of ocr service

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private http = inject(HttpClient);
  private apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${environment.googleCloudApiKey}`;

  extractText(file: File): Observable<{ text: string, languageCode: string }> {
    return this.convertFileToBase64(file).pipe(
      switchMap(base64Image => {
        const payload = {
          requests: [
            {
              image: {
                content: base64Image
              },
              features: [
                {
                  type: 'TEXT_DETECTION'
                }
              ]
            }
          ]
        };

        return this.http.post<any>(this.apiUrl, payload).pipe(
          map(response => {
            console.log('OCR API Response:', response);
            const annotations = response.responses[0]?.textAnnotations;
            const fullTextAnnotation = response.responses[0]?.fullTextAnnotation;
            
            let detectedLocale = 'en-US';

            // Try to get language from fullTextAnnotation (usually more accurate)
            if (fullTextAnnotation?.pages?.[0]?.property?.detectedLanguages?.length > 0) {
              detectedLocale = fullTextAnnotation.pages[0].property.detectedLanguages[0].languageCode;
            } 
            // Fallback to textAnnotations
            else if (annotations && annotations.length > 0 && annotations[0].locale) {
              detectedLocale = annotations[0].locale;
            }

            console.log('Detected Locale from OCR:', detectedLocale);

            if (annotations && annotations.length > 0) {
              return {
                text: annotations[0].description,
                languageCode: detectedLocale
              };
            }
            return { text: 'No text found in image.', languageCode: 'en-US' };
          })
        );
      })
    );
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
```