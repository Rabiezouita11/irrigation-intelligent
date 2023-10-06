import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = '7f101f5d9a62408ea03b24f788069243'; // Replace with your Weatherbit API key
  private apiUrl = 'https://api.weatherbit.io/v2.0/';

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

  getWeatherDataByCoords(coords: any): Observable<any> {
    // Fetch weather data using the coordinates
    const params = {
      lat: coords.latitude.toString(),
      lon: coords.longitude.toString(),
      key: this.apiKey,
    };

    return this.http.get(`${this.apiUrl}/current`, { params });
  }
}
