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
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/CapteurDePluie', { headers });
  }


  getCapteurNiveauDeau(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/CapteurDeNiveauEau', { headers });
  }


  getHistorique(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/Historique', { headers });
  }

  getHumiditerAgriculteur(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/HimiditerAgriculteur', { headers });
  }


  getHumiditerSol(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/HimiditerSol', { headers });
  }
  getMode(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/Mode', { headers });
  }
  getpompe(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/Pompe', { headers });
  }
  getStatusSystem(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/StatusSystem', { headers });
  }
  getSystem(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/System', { headers });
  }

  getTemperatureAirData(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/getTemperatureAir', { headers });
  }
  getProfile(): Observable<any> {
    // Retrieve the Firebase ID token from localStorage
    const firebaseIdToken = localStorage.getItem('firebaseIdToken');

    // Set up the HTTP headers with the token
    const headers = new HttpHeaders({
      'Authorization': `${firebaseIdToken}` // Include the token in the "Bearer" format
    });

    // Make an authenticated request to your backend
    return this.httpClient.get('https://backend-system-irrigation-intelligent.onrender.com/Profile', { headers });
  }


  changeMode(mode: string) {
    return this.httpClient.put<any>('https://backend-system-irrigation-intelligent.onrender.com/changeMode', { mode });
  }
  
  changePompe(pompe: boolean) {
    return this.httpClient.put<any>('https://backend-system-irrigation-intelligent.onrender.com/changePompe', { pompe });
  }
  changeSystem(System: string) {
    return this.httpClient.put<any>('https://backend-system-irrigation-intelligent.onrender.com/changeSystem', { System });
  }
  changerHumiditerAgriculture(status: number | undefined) {
    return this.httpClient.put<any>('https://backend-system-irrigation-intelligent.onrender.com/changerHumiditerAgriculture', { status });
  }


  
  
}