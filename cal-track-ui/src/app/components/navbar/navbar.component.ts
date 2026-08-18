import { Component, inject} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, TooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  authService = inject(AuthService);

  constructor(
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private router: Router
  ) { }

  /**
   * Shows a confirmation popup for user logout and makes the API call
   */
  logout() {
    this.confirmationService.confirm({
    header: 'Logout',
    message: 'Are you sure you want to logout?',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
      accept: () => {
        this.authService.logout();
        this.toastService.success('Success', 'Logged Out Successfully');
      }
    });
  }

  /**
   * Navigates to a certain path
   */
  navigate(path: string) {
    this.router.navigate([path]);
  }
}
