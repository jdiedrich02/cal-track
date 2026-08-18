import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, RouterLink, FormsModule, InputTextModule, PasswordModule, ButtonModule, CardModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private toastService: ToastService, private router: Router) { }

  /**
   * Makes an API call to register the user in the application
   */
  signup() {
    const body = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.apiService.post('auth/register', body).subscribe({
      next: (data: any) => {
        this.toastService.success('Success', data.message);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.toastService.error('Error', error.error.message);
      }
    });
  }
}
