import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastService } from '../../services/toast.service';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { AddMealEntryComponent } from '../../components/add-meal-entry/add-meal-entry.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, TooltipModule, TagModule, DialogModule, DividerModule, AddMealEntryComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild('addEntryDialog') addEntryDialog!: AddMealEntryComponent;

  calorieGoal: number | null = null;
  proteinGoal: number | null = null;
  foodLog: any[] = [];
  mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  showSummary = false;
  showHistory = false;
  history: any[] = [];
  historyLoading = false;
  
  // Username from auth service
  get userName() {
    return this.authService.userName || '';
  }

  // Greeting based on the current time of day
  get timeOfDay(): string {
    const date = new Date();
    const hour: number = date.getHours();

    if (hour < 12) {
      return 'Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Afternoon';
    } else {
      return 'Evening';
    }
  }

  // Total calories for the day
  get totalCalories(): number {
    return this.foodLog.reduce((sum, entry) => sum + entry.calories, 0);
  }

  // Total protein for the day
  get totalProtein(): number {
    return this.foodLog.reduce((s, e) => s + (e.protein ?? 0), 0);
  }

  // Total carbs for the day
  get totalCarbs(): number {
    return this.foodLog.reduce((s, e) => s + (e.carbs ?? 0), 0);
  }

  // Difference between calorie goal and total calories
  get calorieDiff(): number {
    return (this.calorieGoal ?? 0) - this.totalCalories;
  }

  get isOver(): boolean {
    return this.calorieDiff < 0;
  }

  // Status message for the day - used for status message in summary dialog
  get statusMessage(): string {
    if (this.calorieDiff === 0){
      return 'Right on target.';
    }
    
    if (this.isOver){
      return `${Math.abs(this.calorieDiff)} calories over today's goal.`;
    }
    
    return `${this.calorieDiff} calories left for today.`;
  }

  // Progress percentage for the day - used for progress bar in summary dialog
  get progressPercent(): number {
    if (!this.calorieGoal){
      return 0;
    }

    return Math.min((this.totalCalories / this.calorieGoal) * 100, 100);
  }

  // Progress percentage for protein
  get proteinProgressPercent(): number {
    if (!this.proteinGoal) {
      return 0;
    }

    return Math.min((this.totalProtein / this.proteinGoal) * 100, 100);
  }

  get isProteinOver(): boolean {
    return this.totalProtein >= (this.proteinGoal ?? 0);
  }

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  /**
   * Gets all the needed data for the entire dashboard UI
   */
  private getData() {
    this.loadSettings();
    this.loadFoodLog();
  }

  /**
   * Loads the user's calorie goal from the settings endpoint
   */
  private loadSettings() {
    this.apiService.get('settings/cal-settings').subscribe({
      next: (data: any) => {
        this.calorieGoal = data?.calorie_goal ?? null;
        this.proteinGoal = data?.protein_goal ?? null;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  /**
   * Loads the user's food log for today which is used to display the food log on the dashboard
   */
  private loadFoodLog() {
    this.apiService.get('food-log/today').subscribe({
      next: (data: any) => {
        this.foodLog = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  /**
   * Get entries for a specific meal type (Breakfast, Lunch, Dinner, Snack)
   */
  public entriesFor(mealType: string): any[] {
    return this.foodLog.filter(e => e.meal_type === mealType);
  }

  /**
   * Get total calories for a specific meal type
   * Used in template to display calories for each meal type
   */
  public mealTypeCalories(mealType: string): number {
    return this.entriesFor(mealType).reduce((s, e) => s + e.calories, 0);
  }

  public mealTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  /**
   * Opens the add food entry dialog
   */
  public openAddEntry() {
    this.addEntryDialog.open();
  }

  /**
   * Opens the summary dialog
   */
  public openSummary() {
    this.showSummary = true;
  }

  /**
   * Opens the history dialog & loads the users history data
   */
  public openHistory() {
    this.showHistory = true;
    this.loadHistory();
  }

  /**
   * Makes an API call to get the user's food log history and stores the result
   */
  private loadHistory() {
    this.historyLoading = true;
    this.apiService.get<any[]>('food-log/history').subscribe({
      next: (data) => {
        this.history = data;
        this.historyLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.historyLoading = false;
      }
    });
  }

  public formatHistoryDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  /**
   * Called when a food entry is saved - reloads the food log
   */
  public onEntrySaved() {
    this.loadFoodLog();
  }

  /**
   * Deletes a food entry
   */
  public deleteEntry(entryId: number) {
    this.confirmationService.confirm({
      header: 'Remove Entry',
      message: 'Are you sure you want to remove this entry?',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      acceptButtonProps: { severity: 'danger' },
      accept: () => {
        this.apiService.delete(`food-log/${entryId}`).subscribe({
          next: () => {
            this.toastService.success('Entry removed.');
            this.loadFoodLog();
          },
          error: (err) => {
            console.error(err);
            this.toastService.error('Failed to delete entry.');
          }
        });
      }
    });
  }
}
