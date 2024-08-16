import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private httpClient: HttpClient) { }



  getCapteurDepluie(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/CapteurDePluie', { headers });
  }


  getCapteurNiveauDeau(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/CapteurDeNiveauEau', { headers });
  }


  getHistorique(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/Historique', { headers });
  }

  getHumiditerAgriculteur(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/HimiditerAgriculteur', { headers });
  }


  getHumiditerSol(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/HimiditerSol', { headers });
  }
  getMode(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/Mode', { headers });
  }
  getpompe(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/Pompe', { headers });
  }
  getStatusSystem(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/StatusSystem', { headers });
  }
  getSystem(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/System', { headers });
  }

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
  getProfile(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('http://localhost:5000/Profile', { headers });
  }


  changeMode(mode: string) {
    return this.httpClient.put<any>('http://localhost:5000/changeMode', { mode });
  }
  
  changePompe(pompe: boolean) {
    return this.httpClient.put<any>('http://localhost:5000/changePompe', { pompe });
  }
  changeSystem(System: string) {
    return this.httpClient.put<any>('http://localhost:5000/changeSystem', { System });
  }
  changerHumiditerAgriculture(status: number | undefined) {
    return this.httpClient.put<any>('http://localhost:5000/changerHumiditerAgriculture', { status });
  }


  
  
}