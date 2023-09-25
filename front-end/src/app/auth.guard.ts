// src/app/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map((user) => {
        if (user) {
          // User is authenticated
          return true;
        } else {
          // User is not authenticated, redirect to the login page
          this.router.navigate(['/signin']);
          return false;
        }
      })
    );
  }
}
