import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DataService } from 'src/app/components/navbar/services/data.service';
import { UserService } from 'src/app/components/navbar/services/user.service';
import { WebSocketService } from 'src/app/components/navbar/services/web-socket.service';
import { ScriptService } from 'src/app/script.service';
import { AuthenticationService } from '../../components/navbar/services/authentication.service';
import { Router } from '@angular/router';
import { WeatherService } from 'src/app/components/navbar/services/weather.service';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgZone } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
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
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective; // Optional chaining
  // chart Soil Humidity Levels
  gaugeData: ChartData<'doughnut'> = {
    labels: ['Humidity', ''],
    datasets: [
      {
        data: [0, 100], // Initialize with 0% humidity
        backgroundColor: ['#4CAF50', '#E0E0E0'], // Colors for the chart
        borderWidth: 1,
      }
    ]
  };

  gaugeOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '80%',
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: {
        display: true,
        labels: {
          filter: (legendItem) => legendItem.text !== '', // Filter out the empty label
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const humidity = context.chart.data.datasets[0].data[0]; // Assuming humidity is the first data point
            if (context.raw === humidity) {
              return `Humidity: ${context.raw}%`;
            }
            return `Remaining: ${context.raw}%`; // Professionally labeled for the remaining part
          }
        }
      }
    }
  };
  
  chartData!: ChartData<'line'>;
  chartOptions!: ChartOptions<'line'>;

  // chart Online duration System
  weatherData: any;


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
  pompeState: boolean = false; // Initialize to the desired initial state
  humidity!: number; // You can initialize it as needed
  getSatistiquePompe: any;
  isSystemOnlineStatus: boolean = true; // Initialize it with a default value

  private getStatusSystemSubject = new BehaviorSubject<any>(null); // Initialize with null or default value

  constructor(private weatherService: WeatherService ,private userService: UserService, private webSocketService: WebSocketService, private httpClient: HttpClient,
    private cdr: ChangeDetectorRef, private dataService: DataService, private ScriptServiceService: ScriptService,
    private renderer: Renderer2, private zone: NgZone // Inject NgZone here
    , private authenticationService: AuthenticationService, private router: Router, private toastrService: ToastrService,


  ) { }

  ngOnInit(): void {
   // this.getWeather();
   Chart.register(...registerables);
   this.getWeather();

    // this.weatherService.getCurrentLocation().subscribe(
    //   (coords) => {
    //      console.log(coords)
    //     this.weatherService.getWeather(coords).subscribe(
    //       (data) => {
    //        // this.setWeather(data);
    //          console.log(data)
    //       },
    //       (error) => {
    //         console.error('Error fetching weather data:', error);
    //       }
    //     );
    //   },
    //   (error) => {
    //     console.error('Error getting location:', error);
    //   }
    // );

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
      // console.log(this.currentUserEmail);
    });
    this.getCapteurDePluie();
    this.CapteurNiveauDeau();
    this.Mode();
    this.getProfile();
    this.HimiditerSol();
    this.System();
    this.HimiditerAgriculteur();
    this.pompe();
    //  this.isSystemOnline();
    //   this.initWebSocket();

    this.getStatusSystemSubject.subscribe(status => {
      if (status !== null) {
        this.isSystemOnline();
      }
    });

    this.statusSystem();
    this.checkSystemStatus();


   

  }

  getWeather(): void {
    this.weatherService.getCurrentLocation().subscribe(
      (coords) => {
        this.weatherService.getWeather(coords).subscribe(
          (data) => {
            console.log('Weather Data:', data);
            this.weatherData = data;
            this.prepareChartData(data);
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
  prepareChartData(data: any): void {
    // Extract minutely data
    const minutelyData = data.timelines.minutely;
    const labels = minutelyData.map((entry: any) => new Date(entry.time).toLocaleTimeString());
    const temperatures = minutelyData.map((entry: any) => entry.values.temperature);
    const humidities = minutelyData.map((entry: any) => entry.values.humidity);
    const cloudCovers = minutelyData.map((entry: any) => entry.values.cloudCover);
    const dewPoints = minutelyData.map((entry: any) => entry.values.dewPoint);
    const pressures = minutelyData.map((entry: any) => entry.values.pressureSurfaceLevel);
    const uvIndexes = minutelyData.map((entry: any) => entry.values.uvIndex);
    const windSpeeds = minutelyData.map((entry: any) => entry.values.windSpeed);

    // Example chart data for temperature, humidity, and other metrics
    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: 'blue',
          backgroundColor: 'lightblue',
          fill: false
        },
        {
          label: 'Humidity (%)',
          data: humidities,
          borderColor: 'green',
          backgroundColor: 'lightgreen',
          fill: false
        },
        {
          label: 'Cloud Cover (%)',
          data: cloudCovers,
          borderColor: 'gray',
          backgroundColor: 'lightgray',
          fill: false
        },
        {
          label: 'Dew Point (°C)',
          data: dewPoints,
          borderColor: 'purple',
          backgroundColor: 'lightpurple',
          fill: false
        },
       
        {
          label: 'UV Index',
          data: uvIndexes,
          borderColor: 'yellow',
          backgroundColor: 'lightyellow',
          fill: false
        },
        {
          label: 'Wind Speed (m/s)',
          data: windSpeeds,
          borderColor: 'red',
          backgroundColor: 'lightcoral',
          fill: false
        }
      ]
    };

    // Example chart options
    this.chartOptions = {
      responsive: true,
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10
          }
        },
        y: {
          beginAtZero: true
        }
      }
    };
  }
  // getWeather(): void {
  //   this.weatherService.getWeather(this.latitude, this.longitude).subscribe(
  //     data => {
  //       this.weatherData = data;
  //       console.log('Current Weather Data:', this.weatherData);
  //     },
  //     error => {
  //       console.error('Error fetching weather data:', error);
  //     }
  //   );
  // }

  updateChart(data: number[], labels: string[]): void {
    if (this.chart?.chart) {
      this.chart.chart.data.datasets[0].data = data;
      this.chart.chart.data.labels = labels;
      this.chart.chart.update(); // Ensure chart instance is available and updated
    } else {
      console.error('Chart instance is not available.');
      this.gaugeData.datasets[0].data = data;
      this.gaugeData.labels = labels;
    }
  }


  getCapteurDePluie() {
    this.dataService.getCapteurDepluie().subscribe((initialData) => {
      this.getCapteurDepluie = initialData;
      // console.log('aaa' + this.getCapteurDepluie)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }
  Mode() {
    this.dataService.getMode().subscribe((initialData) => {
      this.getMode = initialData;
      // console.log('aaa' + this.getMode)
      // Initialize WebSocket connection to listen for updates

    });

  }
  // statusSystem() {
  //   this.dataService.getStatusSystem().subscribe((initialData) => {
  //     this.getStatusSystem = initialData;
  //     console.log('aaa' + this.getStatusSystem)
  //     // Initialize WebSocket connection to listen for updates
  //     this.initWebSocket();
  //   });

  // }
  statusSystem() {
    this.dataService.getStatusSystem().subscribe((initialData) => {
      this.getStatusSystem = initialData;
      this.getStatusSystemSubject.next(this.getStatusSystem); // Notify subscribers of the change
    });


  }
  private checkSystemStatus(): void {
    // Run the check inside NgZone to ensure Angular's change detection works
    this.zone.run(() => {
      this.isSystemOnline(); // Check the status

      // Re-schedule the next check after a delay (e.g., every 1 second)
      setTimeout(() => this.checkSystemStatus(), 1000); // Adjust the interval as needed
    });
  }

  System() {
    this.dataService.getSystem().subscribe((initialData) => {
      this.getSystem = initialData;
      // console.log('aaa' + this.getSystem)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }
  CapteurNiveauDeau() {
    this.dataService.getCapteurNiveauDeau().subscribe((initialData) => {
      this.getCapteurNiveauDeau = initialData;
      // console.log('aaa' + this.getCapteurNiveauDeau)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }

  HimiditerSol() {
    this.dataService.getHumiditerSol().subscribe((initialData) => {
      console.log('Initial Humidity Data:', initialData);

      this.getHumiditerSol = initialData;
      this.updateGaugeChart(initialData);

      this.initWebSocket();
    });
  }
  updateGaugeChart(humidity: number): void {
    const remaining = 100 - humidity;
    if (this.chart?.chart) {
      this.chart.chart.data.datasets[0].data = [humidity, remaining];
      this.chart.chart.update(); // Ensure the chart is updated
    } else {
      this.gaugeData.datasets[0].data = [humidity, remaining];
    }
  }
  pompe() {
    this.dataService.getpompe().subscribe((initialData) => {
      this.getpompe = initialData;
      // console.log('aaa' + this.getpompe)
      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }
  HimiditerAgriculteur() {
    this.dataService.getHumiditerAgriculteur().subscribe((initialData) => {
      this.getHumiditerAgriculteur = initialData;
      // console.log('aaa' + this.getHumiditerAgriculteur)
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
      // console.log(this.nom);
      // Initialize WebSocket connection to listen for updates
    });
  }
  isSystemOnline(): boolean {
    // Parse the date string to a Date object
    const formattedStatusSystem = new Date(this.getStatusSystem);

    // Log the parsed date
    //  console.log('formattedStatusSystem:', formattedStatusSystem);

    // Check if the date is valid
    if (isNaN(formattedStatusSystem.getTime())) {
      console.error('Invalid date format:', this.getStatusSystem);
      this.isSystemOnlineStatus = false;
      return false;
    }

    // Get the current date and time
    const currentDate = new Date();
    //console.log('currentDate:', currentDate);

    // Calculate the time difference in milliseconds
    const timeDifferenceMillis = formattedStatusSystem.getTime() - currentDate.getTime();

    // Convert the time difference to seconds
    const timeDifferenceSeconds = timeDifferenceMillis / 1000;
    //  console.log('Time difference in seconds:', timeDifferenceSeconds);

    // Determine if the system is online based on the 10-second threshold
    const isOnline = timeDifferenceSeconds > -20;

    // Update the system online status
    this.isSystemOnlineStatus = isOnline;
    // console.log('isSystemOnlineStatus:', this.isSystemOnlineStatus);

    return isOnline;
  }






  private initWebSocket(): void {
    this.webSocketService.getSocket().subscribe((message) => {
      //   const currentTime = new Date();

      if (message.getCapteurDepluie !== undefined) {
        // Update with the real-time data
        this.getCapteurDepluie = message.getCapteurDepluie;


        // Manually trigger change detection
        this.cdr.detectChanges();

      }
      if (message.getHumiditerSol !== undefined) {
        // Update with the real-time data
        const currentTime = new Date().toLocaleTimeString();

        this.getHumiditerSol = message.getHumiditerSol;
        
       // this.updateChart([message.getHumiditerSol], [currentTime]);
        this.updateGaugeChart(message.getHumiditerSol);

        // Manually trigger change detection
        this.cdr.detectChanges();
      }
      if (message.getStatusSystem !== undefined) {
        this.getStatusSystem = message.getStatusSystem;
        this.getStatusSystemSubject.next(this.getStatusSystem); // Notify subscribers of the change
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
      if (message.getpompe !== undefined) {
        // Update with the real-time data
        this.getpompe = message.getpompe;

        // Manually trigger change detection
        this.cdr.detectChanges();
      }
      if (message.getSatistiquePompe !== undefined) {
        // Update with the real-time data
        this.getSatistiquePompe = message.getSatistiquePompe;
        // console.log(this.getSatistiquePompe)
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
  changePompe(event: any) {
    const newState = event.target.checked; // Get the new state from the checkbox

    // Check if the water level is low and the pump is not turned on
    if (this.getCapteurNiveauDeau === 'low') {
      // Show an error toast
      this.toastrService.error('Water level is low. Verify the water level and turn on the pump if needed.', 'Error', { timeOut: 7000 });
      return; // Stop further execution
    }

    // Call the service method to change the state (you can pass newState to the service)
    this.dataService.changePompe(newState).subscribe(
      (response) => {
        // Handle the response if needed
        // console.log(response);
      },
      (error) => {
        // Handle errors if needed
        console.error(error);
      }
    );

    // Update the toast message based on the new state
    const message = newState ? 'POMPE is ON' : 'POMPE is OFF';
    const toastType = newState ? 'success' : 'info';

    if (toastType === 'info') {
      this.toastrService.info(message, 'Status Pompe', { timeOut: 7000 });
    } else {
      this.toastrService.success(message, 'Status Pompe', { timeOut: 7000 });
    }

    // Update the component's state
    this.pompeState = newState;
  }

  changeSystem(status: string) {
    this.dataService.changeSystem(status).subscribe(

    );

    if (this.getSystem === 'OFF') {
      this.toastrService.success(status, 'Status System', { timeOut: 7000 }); // Display custom error message in a toast

    } else {
      this.toastrService.warning(status, 'Status System', { timeOut: 7000 }); // Display custom error message in a toast

    }
    this.ngOnInit();
  }
  saveChanges() {

    const maxHumidity = this.getHumiditerSol; // Replace this with the actual method to get max humidity
    console.log(maxHumidity);
    if (this.humidity === null) {
      this.toastrService.error(`Humidity required`, 'Humidity validation', { timeOut: 7000 });
      return
    }
    if (isNaN(this.humidity)) {
      // Handle the case where the form is invalid or the input is not a valid number
      this.toastrService.error(`Please enter a valid numeric value for humidity.`, 'Humidity validation', { timeOut: 7000 });
      return;
    }
    if (isNaN(this.humidity) || this.humidity <= 0) {
      // Handle the case where the input is not a valid number or is less than 0
      this.toastrService.error(`Please enter a valid numeric value greater than  0 for humidity.`, 'Humidity validation', { timeOut: 7000 });
      return;
    }
    // if (this.humidity > maxHumidity) {
    //   this.toastrService.error(`Humidity should not exceed ${maxHumidity}%.`, 'Humidity validation', { timeOut: 7000 });
    //   return;
    // }

    this.dataService.changerHumiditerAgriculture(this.humidity).subscribe();
    this.toastrService.success(`Humidity level changed to ${this.humidity}%`, 'Humidity Change', { timeOut: 7000 });
    this.ngOnInit();
  }

}
