import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Import FormsModule here
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, RouterLink],  // Add FormsModule here
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  age: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  signIn() {
    alert(this.email + this.password);

    if (!this.email || !this.password) {
      alert('Please enter both email and password');
      return;
    }
  
    this.http.post('http://localhost:3000/api/signin', {
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (response: any) => {
        alert('Sign-in Successful');
        sessionStorage.setItem('user', JSON.stringify(response.user));
        sessionStorage.setItem('isSignedIn', 'true');
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Sign-in failed ');
      },
    });
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  scrollToFragment(fragmentGo:string): void {
    this.router.navigate(['/about'], { fragment: fragmentGo }).then(() => {
      const element = document.getElementById(fragmentGo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

}