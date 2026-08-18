import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Allow access during loading phase - user can refresh the page and still be logged in
    if (this.authService.isLoading) {
      return true;
    }
    
    const isAuthenticated = this.authService.isAuthenticated;
    
    if (isAuthenticated) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
