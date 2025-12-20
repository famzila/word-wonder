import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';

interface WordDetails {
  definition: string;
  imageSearchQuery: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenAI;

  // Strict safety settings for kids app
  private readonly safetySettings: any[] = [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
  ];

  constructor() {
    this.genAI = new GoogleGenAI({
      apiKey: environment.googleCloudApiKey
    });
  }

  async generateWordDetails(word: string, contextSentence: string, targetLang: string): Promise<WordDetails> {
    try {
      const prompt = `
        Word: "${word}"
        Context: "${contextSentence}"
        Target Language: ${targetLang}
        
        1. Provide a simple, child-friendly definition (max 20 words).
        2. Analyze the 'Context' sentence to find the semantic dependency for the word:
           - If adjective (e.g. 'red'): Identify the noun it modifies (e.g. 'ball') -> Query "red ball".
           - If verb (e.g. 'running'): Identify the subject (e.g. 'dog') -> Query "dog running".
           - If noun: Use the word itself + context clues.
        3. Generate a 'imageSearchQuery' based on that dependency:
           - COLORS: Use "texture of [dependency]" or "color swatch".
           - CONCRETE OBJECTS: Add "isolated" or "simple" (e.g. "beach ball isolated").
           - ACTIONS: Use "kid [dependency]" if generic, or specific subject.
           - ABSTRACT/GRAMMAR: Return NULL.
           - AMBIGUOUS: Use context to disambiguate.
      `;

      const response = await this.genAI.models.generateContent({
        model: (environment as any).geminiModel || 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              definition: { 
                type: 'STRING', 
                description: `A simple definition of the word for a 5-year-old child in ${targetLang}. Max 20 words.` 
              },
              imageSearchQuery: { 
                type: 'STRING', 
                nullable: true,
                description: "A specific, context-aware English search term for a photo. MUST be null if abstract." 
              }
            },
            required: ['definition']
          },
          safetySettings: this.safetySettings
        }
      });

      const responseText = response.text;
      
      if (!responseText) {
        throw new Error('Empty response from Gemini');
      }

      return JSON.parse(responseText) as WordDetails;
    } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback
        return {
            definition: 'Definition unavailable.',
            imageSearchQuery: null
        };
    }
  }

  async generateImage(prompt: string): Promise<string | null> {
    const model = (environment as any).geminiImageModel || 'imagen-3.0-generate-001';
    
    try {
      // 1. IMAGEN MODEL (e.g. imagen-3.0-generate-001)
      if (model.toLowerCase().includes('imagen')) {
        const response = await this.genAI.models.generateImages({
          model: model,
          prompt: `A cute, child-friendly illustration of: ${prompt}. White background, simple style.`,
          config: {
            numberOfImages: 1,
            aspectRatio: '1:1',
            // Imagen might handle safety differently, but passing it if supported by specific version
             safetySettings: this.safetySettings
          } as any 
        });
        
        // Cast to any to handle potential type mismatches or beta SDK properties
        const respAny = response as any;
        if (respAny.images?.[0]?.imageBytesBase64) {
             return `data:image/jpeg;base64,${respAny.images[0].imageBytesBase64}`;
        }
        return null;
      } 
      
      // 2. GEMINI MODEL (e.g. gemini-2.5-flash-image)
      else {
        // Use generateContent with responseModalities for Gemini models
        const response = await this.genAI.models.generateContent({
            model: model,
            contents: `Generate a cute, child-friendly illustration of: ${prompt}. White background, simple flat style.`,
            config: {
               responseModalities: ['IMAGE'], // Force image generation
               safetySettings: this.safetySettings
            } as any // Cast to avoid type error if property missing in definitions
        });

        // Parse response for inline image data
        // Typically located in parts[].inlineData or similar structure for Gemini
        const candidates = response.candidates;
        if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
             const parts = candidates[0].content.parts;
             for (const part of parts) {
                 if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
                     return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                 }
             }
        }
        
        console.warn('No image data found in Gemini response parts');
        return null;
      }

    } catch (error) {
      console.error('Gemini Image Gen Error:', error);
      return null;
    }
  }
}
