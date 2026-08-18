import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject(null);
  private isAuthenticatedSubject = new BehaviorSubject(false);
  private isLoadingSubject = new BehaviorSubject(true);
  
  user$ = this.userSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  
  get user(): any {
    return this.userSubject.value;
  }
  
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
  
  get userName(): string {
    return this.user?.username || '';
  }
  
  get isLoading(): boolean {
    return this.isLoadingSubject.value;
  }

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  /**
   * Initialize authentication state on app startup
   */
  initAuth(): void {
    this.checkAuthStatus();
  }

  /**
   * Check current authentication status
   */
  checkAuthStatus(): void {
    this.apiService.get('auth/me').subscribe({
      next: (user: any) => {
        this.userSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        this.isLoadingSubject.next(false);
      },
      error: (error) => {
        if (error.error?.message === 'Not authenticated') {
          this.clearAuthState();
        }
        this.isLoadingSubject.next(false);
        console.error('Auth check failed:', error);
      }
    });
  }

  /**
   * Login with credentials
   */
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.apiService.post('auth/login', credentials).pipe(
      tap((user: any) => {
        this.userSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        this.isLoadingSubject.next(false);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.apiService.post('auth/logout', {}).subscribe({
      next: () => {
        this.clearAuthState();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.clearAuthState();
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Clear authentication state
   */
  private clearAuthState(): void {
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.isLoadingSubject.next(false);
  }

  /**
   * Navigate to login page
   */
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}
