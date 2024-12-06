import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Import FormsModule here
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,

  imports: [FormsModule, RouterLink], // Add FormsModule here
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  age: number | null = null;

  // Password validation flags
  passwordContainsUppercase: boolean = false;
  passwordContainsSpecialChar: boolean = false;
  passwordMinLength: boolean = false;
  passwordVisible: boolean = false; // For toggling visibility

  constructor(private http: HttpClient, private router: Router) {}

  // Sign-up method
  signUp() {
    // Email validation check for @ and .com
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      alert('Please enter a valid email address');
      return;
    }

    const passwordValidation = this.validatePassword(this.password);

    if (!passwordValidation.isValid) {
      alert(`Password must meet the following criteria:\n- ${passwordValidation.message}`);
      return;
    }

    this.http
      .post('http://localhost:3000/api/signup', {
        name: this.username,
        email: this.email,
        password: this.password,
        age: this.age,
      })
      .subscribe({
        next: (response: any) => {
          alert('Sign-up Successful');
          sessionStorage.setItem('user', JSON.stringify(response.user));
          sessionStorage.setItem('isSignedIn', 'true');
          this.router.navigate(['/']);
        },
        error: (error) => {
          alert('Sign-up failed.');
        },
      });
  }

  // Validate password with detailed checks
  validatePassword(password: string): { isValid: boolean; message: string } {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 10;

    if (!hasUpperCase) {
      return { isValid: false, message: 'Password must include at least one uppercase letter.' };
    }

    if (!hasSpecialChar) {
      return { isValid: false, message: 'Password must include at least one special character.' };
    }

    if (!hasMinLength) {
      return { isValid: false, message: 'Password must be at least 10 characters long.' };
    }

    return { isValid: true, message: '' };
  }

  // Real-time password strength check
  checkPasswordStrength(password: string): void {
    this.passwordContainsUppercase = /[A-Z]/.test(password);
    this.passwordContainsSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordMinLength = password.length >= 10;
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToFragment(fragmentGo: string): void {
    this.router.navigate(['/about'], { fragment: fragmentGo }).then(() => {
      const element = document.getElementById(fragmentGo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
