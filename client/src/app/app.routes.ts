import { Routes } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { RecipesComponent } from './recipes/recipes.component';
import { SupermarketsComponent } from './supermarkets/supermarkets.component';
import { AboutComponent } from './about/about.component';
import { CarouselComponent } from './carousel/carousel.component';
export const routes: Routes = [
    {path: '', component: HomepageComponent },
    {path: 'signin', component: SigninComponent},
    {path: 'signup', component: SignupComponent},
    {path:'about', component: AboutComponent},
    {path:'supermarkets', component: SupermarketsComponent},
    {path:'recipes', component: RecipesComponent},
    {path:'ingredients', component: IngredientsComponent},
    {path: 'carousel', component: CarouselComponent}

     // Add a route for the new component
  ];
