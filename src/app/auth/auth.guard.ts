import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Session } from '../classes/session';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private session: Session) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    if (this.session.get('login') == '1') {
      return true;
    } else {
      // Store the attempted URL for redirecting
      this.session.set('redirectUrl', url);
      // Navigate to the login page with extras
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
