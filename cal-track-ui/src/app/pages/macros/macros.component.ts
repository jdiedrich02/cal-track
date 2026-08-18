import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-macros',
  imports: [CommonModule, ReactiveFormsModule, DialogModule, InputNumberModule, ButtonModule, TableModule, InputTextModule, SelectButtonModule, TagModule, TooltipModule],
  templateUrl: './macros.component.html',
  styleUrl: './macros.component.scss'
})
export class MacrosComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  macros: any[] = [];
  showMacroDialog = false;
  editingMacroId: number | null = null;
  unitOptions = [
    { label: 'By Grams', value: 'grams' },
    { label: 'By Quantity', value: 'quantity' }
  ];
  form!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.loadMacros();
  }

  /**
   * Loads all macros from the API
   */
  private loadMacros(): void {
    this.apiService.get('macros/all').subscribe({
      next: (data: any) => {
        this.macros = data;
      },
      error: (err) => { 
        console.error(err);
        this.toastService.error('Failed to load macros');
      }
    });
  }

  /**
   * Opens the macro dialog for creating a new macro
   */
  openDialog(): void {
    this.editingMacroId = null;
    this.form = this.buildForm();
    this.showMacroDialog = true;
  }

  /**
   * Opens the macro dialog for editing an existing macro
   */
  editMacro(macro: any): void {
    this.editingMacroId = macro.id;
    this.form = this.buildForm();
    this.form.patchValue({
      name: macro.name,
      unit: macro.unit ?? 'grams',
      grams: macro.grams,
      calories: macro.calories,
      protein: macro.protein,
      carbs: macro.carbs
    });
    this.showMacroDialog = true;
  }

  /**
   * Builds the macro form with validation
   */
  private buildForm(): FormGroup {
    const form = this.fb.group({
      name: [null, Validators.required],
      unit: ['grams', Validators.required],
      grams: [null, [Validators.required, Validators.min(1)]],
      calories: [null, [Validators.required, Validators.min(0)]],
      protein: [null],
      carbs: [null]
    });

    // Toggle grams validation based on unit
    form.get('unit')!.valueChanges.subscribe((unit: string | null) => {
      const gramsCtrl = form.get('grams')!;
      if (unit === 'quantity') {
        gramsCtrl.clearValidators();
        gramsCtrl.setValue(null);
      } else {
        gramsCtrl.setValidators([Validators.required, Validators.min(1)]);
      }
      gramsCtrl.updateValueAndValidity();
    });

    return form;
  }

  /**
   * Closes the macro dialog
   */
  closeDialog(): void {
    this.showMacroDialog = false;
  }

  /**
   * Saves the macro (creates or updates)
   */
  saveMacro(): void {
    if (this.form.invalid) { 
      return;
    }

    const request = this.editingMacroId
      ? this.apiService.put(`macros/${this.editingMacroId}`, this.form.value)
      : this.apiService.post('macros/create', this.form.value);

    request.subscribe({
      next: () => {
        this.loadMacros();
        this.toastService.success(
          this.editingMacroId ? 'Macro Updated Successfully' : 'Macro Created Successfully'
        );
        this.closeDialog();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to save macro');
      }
    });
  }

  /**
   * Deletes a macro after confirmation
   */
  deleteMacro(macro: any): void {
    this.confirmationService.confirm({
      header: 'Delete Macro',
      message: `Are you sure you want to delete "${macro.name}"?`,
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonProps: { severity: 'danger' },
      accept: () => {
        this.apiService.delete(`macros/delete/${macro.id}`).subscribe({
          next: () => {
            this.loadMacros();
            this.toastService.success('Macro Deleted Successfully');
          },
          error: (err) => {
            console.error(err);
            this.toastService.error('Failed to delete macro');
          }
        });
      }
    });
  }
}
