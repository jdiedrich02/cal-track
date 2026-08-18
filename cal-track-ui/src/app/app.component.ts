import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from './services/auth.service';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogModule, ToastModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private authSubscription: Subscription | null = null;
  title = 'cal-track-ui';

  constructor() {}

  ngOnInit(): void {
    this.authService.initAuth();
    
    this.authSubscription = this.authService.isLoading$.subscribe(isLoading => {
      if (!isLoading && !this.authService.isAuthenticated) {
        this.authService.redirectToLogin();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
