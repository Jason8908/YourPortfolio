import { Component, inject, Inject, Input, model, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TransmitCreditsData } from '../../classes/transmit-credits-data';
import { AIModels } from '../../constants/ai-models';
import { NgIf } from '@angular/common';

export interface CoverLetterDialogData {
  selectedAIModel: string;
  selectedType: string;
}

@Component({
  selector: 'app-cover-letter-dialog',
  standalone: true,
  imports: [
    NgIf,
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
  readonly selectedType = model(this.outputData.selectedType);
  readonly aiModels = AIModels;
  readonly CoverLetterTypes = ['brown', 'white', 'blue'];
  readonly ResumeTypes = ['resume-basic', 'resume-basic-2', 'resume-basic-3'];
  constructor(@Inject(MAT_DIALOG_DATA) public data: TransmitCreditsData) {}
  ngOnInit() {
    this.selectedAIModel.set(this.aiModels.Gemini15Flash);
    const defaultType = this.data.type === 'Cover Letter' ? 'brown' : 'resume-basic';
    this.selectedType.set(defaultType);
  }
  selectTemplate(templateNum: number, elemId: string) {
    switch(this.data.type) {
      case 'Cover Letter':
        this.selectedType.set(this.CoverLetterTypes[templateNum-1]);
        break;
      case 'Resume':
        this.selectedType.set(this.ResumeTypes[templateNum-1]);
        break;
    }
    const options = document.querySelectorAll('.template-option');
    options.forEach((option) => {
      option.classList.remove('template-option-selected');
    });
    const selectedOption = document.querySelector(`#${elemId}`);
    if (selectedOption) {
      selectedOption.classList.add('template-option-selected');
    }
  }
  returnResult() {
    return {
      selectedAIModel: this.selectedAIModel(),
      selectedType: this.selectedType(),
    }
  }
}
