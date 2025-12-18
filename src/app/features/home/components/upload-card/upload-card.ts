import { Component, output } from '@angular/core';
import { LucideAngularModule, Upload, Camera } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-card',
  imports: [LucideAngularModule, TranslateModule],
  template: `
    <div class="card bg-white shadow-xl border border-base-200">
      <div class="card-body items-center text-center p-8">
        
        <h2 class="font-heading text-xl text-neutral font-black mb-6">
          {{ 'home.upload_card.title' | translate }}
        </h2>

        <div class="flex gap-8 justify-center w-full">
          <!-- Upload Action -->
          <button (click)="fileInput.click()" class="group flex flex-col items-center gap-2 transition-transform active:scale-95 cursor-pointer">
             <div class="w-16 h-16 rounded-3xl bg-base-200 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
               <lucide-angular [img]="UploadIcon" class="w-8 h-8" strokeWidth="2.5"></lucide-angular>
             </div>
             <span class="text-xs font-bold text-neutral/60 w-24 leading-tight">
               {{ 'home.upload_card.upload_btn' | translate }}
             </span>
             <!-- Hidden File Input -->
             <input #fileInput type="file" accept="image/*" class="hidden" (change)="onFileSelected($event, 'upload')">
          </button>

          <!-- Divider -->
          <div class="divider divider-horizontal mx-0"></div>

          <!-- Camera Action -->
           <button (click)="cameraInput.click()" class="group flex flex-col items-center gap-2 transition-transform active:scale-95 cursor-pointer">
             <div class="w-16 h-16 rounded-3xl bg-base-200 flex items-center justify-center text-secondary group-hover:bg-secondary/10 transition-colors">
               <lucide-angular [img]="CameraIcon" class="w-8 h-8" strokeWidth="2.5"></lucide-angular>
             </div>
             <span class="text-xs font-bold text-neutral/60 w-24 leading-tight">
               {{ 'home.upload_card.camera_btn' | translate }}
             </span>
             <!-- Hidden Camera Input -->
             <input #cameraInput type="file" accept="image/*" capture="environment" class="hidden" (change)="onFileSelected($event, 'camera')">
          </button>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class UploadCard {
  onUpload = output<File>();
  onCamera = output<File>();

  readonly UploadIcon = Upload;
  readonly CameraIcon = Camera;

  onFileSelected(event: Event, type: 'upload' | 'camera') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (type === 'upload') {
        this.onUpload.emit(file);
      } else {
        this.onCamera.emit(file);
      }
      // Reset input value so the same file can be selected again if needed
      input.value = '';
    }
  }
}
