
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.css'
})


export class IngredientsComponent implements OnInit {
  searchTerm: string = '';
  ingredients: any[] = [];
  filteredIngredients: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  ingredientsPerPage: number = 9;
  cart: any[] = [];
  showCartPopup: boolean = false; // Flag to control popup visibility

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['term'] || '';
      this.currentPage = params['page'] ? parseInt(params['page']) : 1;
      this.loadIngredients();
      this.scrollToTop();

    });
  }

  loadIngredients(): void {
    const query = `page=${this.currentPage}&limit=${this.ingredientsPerPage}&term=${this.searchTerm}`;
    this.http.get<any>(`http://localhost:3000/api/ingredients/all?${query}`).subscribe({
      next: (data) => {
        this.ingredients = data.ingredients;
        this.filteredIngredients = this.ingredients;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        console.log('Error fetching ingredients:'+ err);
        alert('Could not load ingredients: ' + JSON.stringify(err)); // Show detailed error
      },
    });
    
  }

  addToCart(ingredient: any): void {
    if (!this.cart.some((item) => item.name === ingredient.name)) {
      this.cart.push(ingredient);
      alert(`${ingredient.name} has been added to the cart.`);
    } else {
      alert(`${ingredient.name} is already in the cart.`);
    }
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    alert('Item removed from the cart.');
  }

  toggleCartPopup(): void {
    this.showCartPopup = !this.showCartPopup;
  }

  generateRecipe(): void {
    const ingredientsList = this.cart.map((item) => item.name).join(',');
    const searchTerm = ingredientsList; // Use the selected ingredients as the search term
    const page = 1; // Default to page 1 for the generated recipes
  
    this.router.navigate(['/recipes'], { queryParams: { term: searchTerm, page: page } });
    this.toggleCartPopup(); // Close popup after navigating
    this.scrollToTop();
  }
  
  scrollToFragment(fragmentGo:string): void {
    this.router.navigate(['/about'], { fragment: fragmentGo }).then(() => {
      const element = document.getElementById(fragmentGo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  search(): void {
    this.router.navigate(['/ingredients'], { queryParams: { term: this.searchTerm, page: 1 } });
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.router.navigate(['/ingredients'], { queryParams: { term: this.searchTerm, page: page } });
    }
    this.scrollToTop();
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
}
