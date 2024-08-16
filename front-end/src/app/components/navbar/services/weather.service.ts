import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey: string = 'N8WR0DoEgcUyZ2jQzy6JxxxbtzFmtcYe'; // Replace with your Tomorrow.io API key
  private baseUrl: string = 'https://api.tomorrow.io/v4/weather/forecast';
  constructor(private http: HttpClient) {}

  getCurrentLocation(): Observable<any> {
    // Use the Geolocation API to get the user's current coordinates
    return new Observable((observer) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position.coords);
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }
  getWeather(coords: any): Observable<any> {

    const params = {
      lat: coords.latitude.toString(),
      lon: coords.longitude.toString(),
      key: this.apiKey,
    };

    const url = `${this.baseUrl}?location=${params.lat},${params.lon}&apikey=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}
