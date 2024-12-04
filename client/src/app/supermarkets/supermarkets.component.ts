import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgFor and other directives

@Component({
  selector: 'app-supermarkets',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './supermarkets.component.html',
  styleUrl: './supermarkets.component.css'
})

export class SupermarketsComponent implements OnInit {
  supermarkets: any[] = []; // Array to hold fetched supermarkets

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSupermarkets();
  }

  // Fetch all supermarkets
  loadSupermarkets(): void {
    this.http.get<any>('http://localhost:3000/api/supermarkets').subscribe({
      next: (response) => {
        this.supermarkets = response.supermarkets;

      },
      error: (error) => {
        console.error('Error loading supermarkets:', error);
        alert('Could not load supermarkets.');
      },
    });
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}