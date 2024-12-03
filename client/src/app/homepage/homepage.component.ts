import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tns } from 'tiny-slider/src/tiny-slider';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule


@Component({
 standalone: true,
 selector: 'app-homepage',
 templateUrl: './homepage.component.html',
 styleUrls: ['./homepage.component.css'],
 imports: [RouterOutlet, RouterLink, CommonModule]
})
export class HomepageComponent implements OnInit {
  user: any = null;
  isSignedIn: boolean = false;

 @ViewChild('generateRecipeButton', { static: false }) generateRecipeButton!: ElementRef;
 @ViewChild('searchMoreIngredientsButton', { static: false }) searchMoreIngredientsButton!: ElementRef;
 @ViewChild('navbarCollapse', { static: false }) navbarCollapse!: ElementRef;


 constructor(private http: HttpClient, private router: Router) {}

 ngOnInit(): void {
  // Check if the user is signed in by reading from sessionStorage
  this.isSignedIn = sessionStorage.getItem('isSignedIn') === 'true';
  const userData = sessionStorage.getItem('user');
  if (userData) {
    this.user = JSON.parse(userData);}
    this.loadScripts();
    this.initializeTinySlider();
    
 }

 signOut() {
  sessionStorage.removeItem('isSignedIn');
  sessionStorage.removeItem('user');
  this.isSignedIn = false;

  // Reload the page to reflect the sign-out state
  window.location.reload();
}

toggleNavbar(): void {
  const navbarElement = this.navbarCollapse.nativeElement;
  if (navbarElement.classList.contains('show')) {
    navbarElement.classList.remove('show');
  } else {
    navbarElement.classList.add('show');
  }
}


 // Initialize the Tiny Slider
 initializeTinySlider() {
   tns({
     container: ".testimonial-one-active",
     items: 3,
     gutter: 0,
     autoplay: true,
     autoplayButtonOutput: false,
     mouseDrag: true,
     slideBy: 'page',
     controls: false,
     controlsText: [
       '<i class="lni lni-arrow-left-circle"></i>',
       '<i class="lni lni-arrow-right-circle"></i>',
     ],
     nav: true,
     speed: 400,
     responsive: {
       0: {
         items: 1,
       },
       768: {
         items: 2,
       },
       1200: {
         items: 3,
       },
     },
   });
 }
 scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

 // Function to load external scripts
 loadScripts() {
   const scripts = [
     'assets/script.js'
   ];

   for (const scriptUrl of scripts) {
     const script = document.createElement('script');
     script.src = scriptUrl;
     script.onload = () => {
       console.log(`Script loaded successfully: ${scriptUrl}`);
     };
     script.onerror = () => {
       console.error(`Error loading script: ${scriptUrl}`);
     };
     document.body.appendChild(script);
   }
 }

 // Function to generate recipes based on selected ingredients
 async generateRecipe() {
  const selectedIngredients = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="ingredient"]:checked'))
    .map(checkbox => checkbox.value);

  if (selectedIngredients.length > 0) {
    try {
      const searchTerm = selectedIngredients.join(','); // Use the ingredients as the search term
      const page = 1; // Default to the first page
      this.router.navigate(['/recipes'], { queryParams: { term: searchTerm, page: page } });
    } catch (error) {
      console.error('Error generating recipe:', error);
      alert('An error occurred while generating the recipe.');
    }
  } else {
    alert('Please select at least one ingredient.');
  }
}

// Function to handle 'search more ingredients' functionality
searchMoreIngredients() {
  this.router.navigate(['/ingredients']); // Redirect to the ingredients page
}
}
