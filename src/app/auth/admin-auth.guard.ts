import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Session } from '../classes/session';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private router: Router, private session: Session) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        var role = this.session.get('role');
        if (url.includes('parking/dashboard') && role === 'admin') {
            return true;
        } else if (url.includes('parking/reports') && (role == 'admin' || role == 'vendor')) {
            return true
        }else if (url.includes('parking/sessions')) {
            return true
        }else if (url.includes('parking/passes')) {
            return true
        }else if (url.includes('parking/settings') && (role == 'admin' || role == 'vendor')) {
            return true
        }else if(url.includes('parking/l') && role=='admin'){
            return true
        }else{
            console.log("route")
        }




        if (this.session.get('role') == 'admin') {
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
