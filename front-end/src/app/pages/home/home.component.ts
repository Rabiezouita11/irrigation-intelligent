import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DataService } from 'src/app/components/navbar/services/data.service';
import { UserService } from 'src/app/components/navbar/services/user.service';
import { WebSocketService } from 'src/app/components/navbar/services/web-socket.service';
import { ScriptService } from 'src/app/script.service';
import { AuthenticationService } from '../../components/navbar/services/authentication.service';
import { Router } from '@angular/router';
import { WeatherService } from 'src/app/components/navbar/services/weather.service';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

const SCRIPT_PATH_LIST = [
  "assets/bundles/libscripts.bundle.js",
  "assets/bundles/vendorscripts.bundle.js",
  "assets/bundles/c3.bundle.js",
  "assets/bundles/mainscripts.bundle.js",
  "assets/iot.js"

]
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUserEmail!: string | null;
  cultureData: any; // Initialize to null or an appropriate default value
  weatherdata: any;
  nom: any;
  getCapteurDepluie: any;
  getMode: any;
  getStatusSystem: any;
  getSystem: any;
  getCapteurNiveauDeau: any;
  getHumiditerSol: any;
  getpompe: any;
  getHumiditerAgriculteur: any;
  mode: any;
  constructor(private userService: UserService, private webSocketService: WebSocketService, private httpClient: HttpClient,
    private cdr: ChangeDetectorRef, private dataService: DataService, private ScriptServiceService: ScriptService,
    private renderer: Renderer2, private authenticationService: AuthenticationService, private router: Router, private weatherService: WeatherService, private toastrService: ToastrService,

  ) { }

  ngOnInit(): void {

    SCRIPT_PATH_LIST.forEach(e => {
      const scriptElement = this.ScriptServiceService.loadJsScript(this.renderer, e);
      scriptElement.onload = () => {
        console.log('loaded');

      }
      scriptElement.onerror = () => {
        console.log('Could not load the script!');
      }

    })

    this.userService.getCurrentUserEmail().then((email) => {
      this.currentUserEmail = email;
      console.log(this.currentUserEmail);
    });
    this.getCapteurDePluie();
    this.CapteurNiveauDeau();
    this.Mode();
    this.getProfile();
    this.HimiditerSol();
    this.System();
    this.HimiditerAgriculteur();
    this.statusSystem();
    this.pompe();
    this.weatherService.getCurrentLocation().subscribe(
      (coords) => {
        console.log(coords)
        this.weatherService.getWeatherDataByCoords(coords).subscribe(
          (data) => {
            this.setWeather(data);
            console.log(data)
          },
          (error) => {
            console.error('Error fetching weather data:', error);
          }
        );
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );

  }
  setWeather(data: any) {
    // Customize this function based on the structure of Weatherbit API response
    this.weatherdata = {
      city_name: data.data[0].city_name,
      country_code: data.data[0].country_code,
      temp: data.data[0].temp,
      min_temp: data.data[0].min_temp,
      max_temp: data.data[0].max_temp,
      app_temp: data.data[0].app_temp,
      sunset: data.data[0].sunset,
      weather: data.data[0].weather.description,

      // Add other properties as needed
    };
  }

  getCapteurDePluie() {
    this.dataService.getCapteurDepluie().subscribe((initialData) => {
      this.getCapteurDepluie = initialData;
      console.log('aaa' + this.getCapteurDepluie)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }
  Mode() {
    this.dataService.getMode().subscribe((initialData) => {
      this.getMode = initialData;
      console.log('aaa' + this.getMode)
      // Initialize WebSocket connection to listen for updates

    });

  }
  statusSystem() {
    this.dataService.getStatusSystem().subscribe((initialData) => {
      this.getStatusSystem = initialData;
      console.log('aaa' + this.getStatusSystem)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });

  }
  System() {
    this.dataService.getSystem().subscribe((initialData) => {
      this.getSystem = initialData;
      console.log('aaa' + this.getSystem)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }
  CapteurNiveauDeau() {
    this.dataService.getCapteurNiveauDeau().subscribe((initialData) => {
      this.getCapteurNiveauDeau = initialData;
      console.log('aaa' + this.getCapteurNiveauDeau)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }

  HimiditerSol() {
    this.dataService.getHumiditerSol().subscribe((initialData) => {
      this.getHumiditerSol = initialData;
      console.log('aaa' + this.getHumiditerSol)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }
  pompe() {
    this.dataService.getpompe().subscribe((initialData) => {
      this.getpompe = initialData;
      console.log('aaa' + this.getpompe)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }
  HimiditerAgriculteur() {
    this.dataService.getHumiditerAgriculteur().subscribe((initialData) => {
      this.getHumiditerAgriculteur = initialData;
      console.log('aaa' + this.getHumiditerAgriculteur)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }
  getProfile() {
    this.dataService.getProfile().pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Handle the 401 error by navigating to the sign-in page
          this.router.navigate(['/signin']); // Make sure to import the Router module
        } else {
          // Handle other errors as needed
          console.error('An error occurred:', error);
        }

        // Rethrow the error so that it can be caught by the subscriber
        return throwError(error);
      })
    ).subscribe((Profiledata) => {
      this.nom = Profiledata.nom;
      console.log(this.nom);
      // Initialize WebSocket connection to listen for updates
    });
  }
  private initWebSocket(): void {
    this.webSocketService.getSocket().subscribe((message) => {

      if (message.getCapteurDepluie !== undefined) {
        // Update with the real-time data
        this.getCapteurDepluie = message.getCapteurDepluie;

        // Manually trigger change detection
        this.cdr.detectChanges();
      }
      if (message.getHumiditerSol !== undefined) {
        // Update with the real-time data
        this.getHumiditerSol = message.getHumiditerSol;

        // Manually trigger change detection
        this.cdr.detectChanges();
      }
      if (message.getStatusSystem !== undefined) {
        // Update with the real-time data
        this.getStatusSystem = message.getStatusSystem;

        // Manually trigger change detection
        this.cdr.detectChanges();
      }
      if (message.getpompe !== undefined) {
        // Update with the real-time data
        this.getpompe = message.getpompe;

        // Manually trigger change detection
        this.cdr.detectChanges();
      }
      if (message.getCapteurNiveauDeau !== undefined) {
        // Update with the real-time data
        this.getCapteurNiveauDeau = message.getCapteurNiveauDeau;

        // Manually trigger change detection
        this.cdr.detectChanges();
      }




    });
  }
  logout() {
    this.router.navigate(['signin']);

    this.authenticationService.logout()
      .subscribe();
  }

  changeMode(mode: string) {
    this.dataService.changeMode(mode).subscribe(

    );
    this.toastrService.success(mode, 'Mode System', { timeOut: 7000 }); // Display custom error message in a toast
    this.ngOnInit();
  }
}
