import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Home} from "./home/home";

@Component({
  selector: 'app-root',
  imports: [Home, RouterLink, RouterOutlet],
  template: `
  <main>
    <a [routerLink]="['/']">
      <header class="brand-name">
        <img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />
      </header>
    </a>
    <section class="content">
      <app-home />
    </section>
  </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  title = 'homes';
}
