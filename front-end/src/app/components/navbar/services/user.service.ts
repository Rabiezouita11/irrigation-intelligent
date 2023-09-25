// src/app/user.service.ts

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: Observable<firebase.default.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  async getCurrentUserEmail(): Promise<string | null> {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        return user.email || null;
      } else {
        return null;
      }
    } catch (error) {
      // Handle any errors that may occur while getting the current user
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Add more user-related methods here
}
