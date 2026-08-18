import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-setup',
  imports: [CommonModule, InputNumberModule, CardModule, FormsModule, ReactiveFormsModule, DropdownModule, ButtonModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent implements OnInit {
  settingsForm!: FormGroup;
  editMode: boolean = false;

  goalTypes = [
    { label: 'Fat Loss (Cut)', value: 'cut' },
    { label: 'Maintain Weight', value: 'maintain' },
    { label: 'Muscle Gain (Bulk)', value: 'bulk' }
  ];

  url: string = 'settings/cal-settings';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.getSettings();
  }

  /**
   * Builds the setings form
   */
  buildForm() {
    this.settingsForm = this.fb.group({
      calorieGoal: ['', Validators.required],
      proteinGoal: [null],
      currentWeight: [null],
      goalType: ['']
    });
  }

  /**
   * Gets the current user's settings from the API
   */
  getSettings() {
    this.apiService.get(this.url).subscribe({
      next: (data: any) => {
        this.settingsForm.setValue({ 
          calorieGoal: data.calorie_goal,
          proteinGoal: data.protein_goal,
          currentWeight: data.starting_weight,
          goalType: data.goal_type
        });
        this.editMode = true;
      },
      error: (error) => {
        this.toastService.error('Error', error.error.message);
      }
    });
  }

  /**
   * Saves the settings to the API
   */
  saveSettings() {
    if (this.editMode === true) {
      this.apiService.put(this.url, this.settingsForm.value).subscribe({
        next: (data: any) => {
          this.toastService.success('Success', data.message);
        },
        error: (error) => {
          this.toastService.error('Error', error.error.message);
        }
      });
    } else {
      this.apiService.post(this.url, this.settingsForm.value).subscribe({
        next: (data: any) => {
          this.toastService.success('Success', data.message);
        },
        error: (error) => {
          this.toastService.error('Error', error.error.message);
        }
      });
    }
    
  }
}
