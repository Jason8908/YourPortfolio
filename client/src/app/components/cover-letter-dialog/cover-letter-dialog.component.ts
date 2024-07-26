import { Component, inject, Inject, Input, model, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TransmitCreditsData } from '../../classes/transmit-credits-data';
import { AIModels } from '../../constants/ai-models';

export interface CoverLetterDialogData {
  selectedAIModel: string;
}

@Component({
  selector: 'app-cover-letter-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './cover-letter-dialog.component.html',
  styleUrl: './cover-letter-dialog.component.css',
})
export class CoverLetterDialogComponent {
  readonly outputData = inject<CoverLetterDialogData>(MAT_DIALOG_DATA);
  readonly selectedAIModel = model(this.outputData.selectedAIModel);
  readonly aiModels = AIModels;
  constructor(@Inject(MAT_DIALOG_DATA) public data: TransmitCreditsData) {}
  ngOnInit() {
    this.selectedAIModel.set(this.aiModels.Gemini15Flash);
  }
}
