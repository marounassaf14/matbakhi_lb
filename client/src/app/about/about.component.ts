import { Component, OnInit } from '@angular/core';
import { RouterLink, Router} from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    //this.scrollToTop();  // Ensure scroll happens when component loads
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
