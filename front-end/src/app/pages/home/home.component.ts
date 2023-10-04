import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DataService } from 'src/app/components/navbar/services/data.service';
import { UserService } from 'src/app/components/navbar/services/user.service';
import { WebSocketService } from 'src/app/components/navbar/services/web-socket.service';
import { ScriptService } from 'src/app/script.service';
import { AuthenticationService } from '../../components/navbar/services/authentication.service';
import { Router } from '@angular/router';

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
  constructor(private userService: UserService, private webSocketService: WebSocketService, private httpClient: HttpClient,
    private cdr: ChangeDetectorRef, private dataService: DataService, private ScriptServiceService: ScriptService,
    private renderer: Renderer2, private authenticationService: AuthenticationService, private router: Router

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
    this.Mode();
    this.getWeather();
    this.getProfile();
  }

  getWeather() {
    let data = JSON.parse('{"coord":{"lon":10.99,"lat":44.34},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"base":"stations","main":{"temp":279.93,"feels_like":279.93,"temp_min":278.52,"temp_max":280.9,"pressure":1012,"humidity":74,"sea_level":1012,"grnd_level":925},"visibility":10000,"wind":{"speed":0.65,"deg":109,"gust":1.67},"clouds":{"all":65},"dt":1668936738,"sys":{"type":2,"id":2044440,"country":"IT","sunrise":1668925099,"sunset":1668959115},"timezone":3600,"id":3163858,"name":"Zocca","cod":200}');
    // console.log(data);
    this.setWeather(data);
  }
  setWeather(data: any) {
    this.weatherdata = data;
    let sunsetTime = new Date(this.weatherdata.sys.sunset * 1000);
    this.weatherdata.sunsetTime = sunsetTime.toLocaleTimeString();
    let currentdate = new Date();
    this.weatherdata.isDay = (currentdate.getTime() < sunsetTime.getTime());

    this.weatherdata.temp_celcius = (this.weatherdata.main.temp - 273.15).toFixed(0);
    this.weatherdata.temp_min = (this.weatherdata.main.temp_min - 273.15).toFixed(0);
    this.weatherdata.temp_max = (this.weatherdata.main.temp_max - 273.15).toFixed(0);
    this.weatherdata.feels_like = (this.weatherdata.main.feels_like - 273.15).toFixed(0);

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



  getProfile() {
    this.dataService.getProfile().subscribe((Profiledata) => {
      this.nom = Profiledata.nom;
      console.log(this.nom);
      // Initialize WebSocket connection to listen for updates

    });
  }
  private initWebSocket(): void {
    this.webSocketService.getSocket().subscribe((message) => {
      console.log('Received message from WebSocket:', message);
      if (message.getCapteurDepluie !== undefined) {
        // Update with the real-time data
        this.getCapteurDepluie = message.getCapteurDepluie;

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
}
