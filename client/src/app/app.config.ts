import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { provideHttpClient } from '@angular/common/http'; // Use provideHttpClient

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),// Add routing if necessary
    provideHttpClient(),  // Correct way to provide HttpClient in Angular 15+
    HomepageComponent,          // Provide CvComponent here
  ],
};