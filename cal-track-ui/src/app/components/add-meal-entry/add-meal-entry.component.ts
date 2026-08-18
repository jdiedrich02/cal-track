import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-meal-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    SelectButtonModule,
    SelectModule
  ],
  templateUrl: './add-meal-entry.component.html',
  styleUrl: './add-meal-entry.component.scss'
})
export class AddMealEntryComponent {
  @Output() entrySaved = new EventEmitter<void>();

  visible = false;
  loading = false;
  macros: any[] = [];
  mealTypeOptions = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'Snack', value: 'snack' }
  ];
  entry: any = {
    macroId: 0,
    grams: 0,
    mealType: 'breakfast'
  };

  get selectedMacro(): any {
    return this.macros.find(m => m.id === this.entry.macroId) ?? null;
  }

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  /**
   * Opens the dialog and loads macros
   */
  open() {
    this.resetForm();
    this.loadMacros();
    this.visible = true;
  }

  /**
   * Closes the dialog
   */
  close() {
    this.visible = false;
  }

  /**
   * Calls the API to save a new mean entry
   */
  save() {
    const isQuantity = this.selectedMacro?.unit === 'quantity';

    if (!this.entry.macroId || !this.entry.mealType) {
      this.toastService.error('Please select a food and meal type.');
      return;
    }

    if (!isQuantity && !this.entry.grams) {
      this.toastService.error('Please enter the grams eaten.');
      return;
    }

    const payload = {
      ...this.entry,
      grams: isQuantity ? 1 : this.entry.grams
    };

    this.loading = true;
    const url = 'food-log/create';
    this.apiService.post(url, payload).subscribe({
      next: () => {
        this.toastService.success('Entry added!');
        this.loading = false;
        this.visible = false;
        this.entrySaved.emit();
      },
      error: () => {
        this.toastService.error('Failed to save entry.');
        this.loading = false;
      }
    });
  }

  /**
   * Loads the macros to select from for a new entry
   */
  private loadMacros() {
    const url = 'macros/all';
    this.apiService.get<any[]>(url).subscribe({
      next: (data) => {
        this.macros = data;
      },
      error: () => {
        this.toastService.error('Failed to load macros.');
      }
    });
  }

  /**
   * Resets the form to its initial state
   */
  private resetForm() {
    this.entry = {
      macroId: 0,
      grams: 0,
      mealType: 'breakfast'
    };
  }
}
