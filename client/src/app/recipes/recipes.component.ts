import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  searchTerm: string = ''; // Search term for filtering recipes by ingredients
  recipes: any[] = []; // Array to hold all fetched recipes
  filteredRecipes: any[] = []; // Array to display filtered recipes
  currentPage: number = 1;
  totalPages: number = 1;
  recipesPerPage: number = 9;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to query parameters and fetch recipes based on search term and pagination
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['term'] || '';
      this.currentPage = params['page'] ? parseInt(params['page']) : 1;
      this.loadRecipes();
    });
  }

  // Fetch recipes dynamically based on the current search term
  loadRecipes(): void {
    const query = `page=${this.currentPage}&limit=${this.recipesPerPage}&term=${this.searchTerm}`;
    this.http.get<any>(`http://localhost:3000/api/recipes/all?${query}`)
      .subscribe({
        next: (data) => {
          this.recipes = data.recipes;
          this.filteredRecipes = this.recipes; // Filtered recipes are updated dynamically
          this.totalPages = data.totalPages;
        },
        error: (err) => {
          console.error('Error fetching recipes:', err);
          alert('Could not load recipes');
        }
      });
  }

  // Fetch suggestions dynamically based on ingredients entered in the search bar
  fetchSuggestions(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value;

    if (!term) {
      this.filteredRecipes = this.recipes; // Reset to all recipes if input is empty
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/recipes/all?term=${term}&page=1`)
      .subscribe({
        next: (data) => {
          this.filteredRecipes = data.recipes; // Dynamically update filtered recipes
        },
        error: (err) => {
          console.error('Error fetching suggestions:', err);
        }
      });
  }

  // Trigger search based on the current search term
  search(): void {
    this.router.navigate(['/recipes'], { queryParams: { term: this.searchTerm, page: 1 } });
  }

  // Update URL and load recipes for the selected page
  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.router.navigate(['/recipes'], { queryParams: { term: this.searchTerm, page: page } });
    }
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
}
