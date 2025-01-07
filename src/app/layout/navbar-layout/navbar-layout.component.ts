import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-navbar-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './navbar-layout.component.html',
  styleUrl: './navbar-layout.component.scss',
})
export class NavbarLayoutComponent {}
