import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private httpClient: HttpClient) { }

  getTemperatureAirData(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/getTemperatureAir', { headers });
  }
}