import { ChangeDetectorRef, Component, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UserService } from 'src/app/components/navbar/services/user.service';
import { WeatherService } from 'src/app/components/navbar/services/weather.service';
import { WebSocketService } from 'src/app/components/navbar/services/web-socket.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/components/navbar/services/data.service';
import { ScriptService } from 'src/app/script.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/components/navbar/services/authentication.service';
import { catchError, throwError } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
const SCRIPT_PATH_LIST = [
  "assets/bundles/libscripts.bundle.js",
  "assets/bundles/vendorscripts.bundle.js",
  "assets/bundles/c3.bundle.js",
  "assets/bundles/mainscripts.bundle.js",
  "assets/iot.js"

]
@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartHistoriquePompoOnData!: ChartData<'line'>;
  chartHistoriquePompoOnOptions!: ChartOptions<'line'>;

  chartHistoriquePompoOffData!: ChartData<'line'>;
  chartHistoriquePompoOffOptions!: ChartOptions<'line'>;


  // New declarations for Capteurdepluie chart
  chartHistoriqueCapteurdepluieData!: ChartData<'line'>;
  chartHistoriqueCapteurdepluieOptions!: ChartOptions<'line'>;

  // New declarations for Water Niveau Sensor chart
  chartHistoriqueWaterNiveauSensorData!: ChartData<'line'>;
  chartHistoriqueWaterNiveauSensorOptions!: ChartOptions<'line'>;


  chartHistoriquePompeConditionsData!: ChartData<'line'>;
  chartHistoriquePompeConditionsOptions!: ChartOptions<'line'>;
  nom: any;
  currentUserEmail!: string | null;
  getSatistiquePompe: any;
  getHistoriqueCapteurdepluiechart: any;

  constructor(
    private weatherService: WeatherService,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef,
    private dataService: DataService,
    private ScriptServiceService: ScriptService,
    private renderer: Renderer2,
    private zone: NgZone,
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUserEmail().then((email) => {
      this.currentUserEmail = email;
      console.log(this.currentUserEmail);
    });
    this.getProfile();
    SCRIPT_PATH_LIST.forEach(e => {
      const scriptElement = this.ScriptServiceService.loadJsScript(this.renderer, e);
      scriptElement.onload = () => {
        console.log('loaded');
      }
      scriptElement.onerror = () => {
        console.log('Could not load the script!');
      }
    })
    this.getHistoriquePompoOn();
    this.getHistoriquePompoOff(); // Add this line

    this.getHistoriqueCapteurdepluie();
    this.getHistoriqueWaterNiveauSensor();
    this.getHistoriquePompewithcondiitons();

  }
  getHistoriquePompewithcondiitons() {
    this.dataService.getHistoriquePompewithcondiitons().subscribe((data) => {
        console.log('Historique getHistoriquePompewithcondiitons Data:', data);

        const entries = Object.entries(data);
        const conditionMap = new Map<string, { waterLevelLow: number; moistureHigh: number; rainDetected: number }>();

        entries.forEach(([key, value]) => {
            const parts = (value as string).split(', ');
            
            // Extract moisture, water level, rain, and timestamp
            const moisture = parts.includes('Moisture High') ? 'Moisture High' : '';
            const waterLevel = parts.includes('Water Level Low') ? 'Water Level Low' : '';
            const rain = parts.includes('Rain Detected') ? 'Rain Detected' : '';
            const timestamp = parts.slice(-1)[0];  // Assume the last part is always the timestamp

            // Validate and parse the date string
            const date = isNaN(Date.parse(timestamp)) ? 'Invalid Date' : new Date(timestamp).toLocaleDateString();

            if (!conditionMap.has(date)) {
                conditionMap.set(date, { waterLevelLow: 0, moistureHigh: 0, rainDetected: 0 });
            }

            if (moisture === 'Moisture High') {
                conditionMap.get(date)!.moistureHigh += 1;
            }
            if (waterLevel === 'Water Level Low') {
                conditionMap.get(date)!.waterLevelLow += 1;
            }
            if (rain === 'Rain Detected') {
                conditionMap.get(date)!.rainDetected += 1;
            }
        });

        const labels = Array.from(conditionMap.keys());
        const waterLevelLowValues = labels.map(label => conditionMap.get(label)!.waterLevelLow);
        const moistureHighValues = labels.map(label => conditionMap.get(label)!.moistureHigh);
        const rainDetectedValues = labels.map(label => conditionMap.get(label)!.rainDetected);

        this.chartHistoriquePompeConditionsData = {
            labels: labels,
            datasets: [
                {
                    label: 'Water Level Low',
                    data: waterLevelLowValues,
                    borderColor: 'blue',
                    backgroundColor: 'lightblue',
                    fill: false,
                },
                {
                    label: 'Moisture High',
                    data: moistureHighValues,
                    borderColor: 'orange',
                    backgroundColor: 'lightorange',
                    fill: false,
                },
                {
                    label: 'Rain Detected',
                    data: rainDetectedValues,
                    borderColor: 'green',
                    backgroundColor: 'lightgreen',
                    fill: false,
                }
            ]
        };

        this.chartHistoriquePompeConditionsOptions = {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                    }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: Math.max(...waterLevelLowValues.concat(moistureHighValues, rainDetectedValues)) + 1,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return Number.isInteger(value) ? value : '';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}`;
                        }
                    }
                }
            }
        };
    });
}


  getHistoriqueWaterNiveauSensor() {
    this.dataService.getHistoriqueWaterNiveauSensor().subscribe((data) => {
      console.log('Historique Water Niveau Sensor Data:', data);

      const entries = Object.entries(data);
      const dateMap = new Map<string, { low: number; medium: number; high: number }>();

      entries.forEach(([key, value]) => {
        const [status, timestamp] = (value as string).split(' ');
        const date = new Date(timestamp).toLocaleDateString();

        if (!dateMap.has(date)) {
          dateMap.set(date, { low: 0, medium: 0, high: 0 });
        }

        if (status === 'LOW') {
          dateMap.get(date)!.low += 1;
        } else if (status === 'MEDIUM') {
          dateMap.get(date)!.medium += 1;
        } else if (status === 'HIGH') {
          dateMap.get(date)!.high += 1;
        }
      });

      const labels = Array.from(dateMap.keys());
      const lowValues = labels.map(label => dateMap.get(label)!.low);
      const mediumValues = labels.map(label => dateMap.get(label)!.medium);
      const highValues = labels.map(label => dateMap.get(label)!.high);

      this.chartHistoriqueWaterNiveauSensorData = {
        labels: labels,
        datasets: [
          {
            label: 'LOW Events',
            data: lowValues,
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            fill: false,
          },
          {
            label: 'MEDIUM Events',
            data: mediumValues,
            borderColor: 'orange',
            backgroundColor: 'lightorange',
            fill: false,
          },
          {
            label: 'HIGH Events',
            data: highValues,
            borderColor: 'red',
            backgroundColor: 'lightcoral',
            fill: false,
          }
        ]
      };

      this.chartHistoriqueWaterNiveauSensorOptions = {
        responsive: true,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...lowValues.concat(mediumValues, highValues)) + 1,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                return Number.isInteger(value) ? value : '';
              }
            }
          }
        }
      };

      // If you're using ng2-charts, ensure the chart updates dynamically
      if (this.chart?.chart) {
        this.chart.chart.update();
      }

      this.initWebSocket();  // Initialize WebSocket if necessary
    });
  }

  getHistoriqueCapteurdepluie() {
    this.dataService.getHistoriqueCapteurdepluie().subscribe((data) => {

      const entries = Object.entries(data);
      const dateMap = new Map<string, { high: number; low: number }>();

      entries.forEach(([key, value]) => {
        const [status, timestamp] = (value as string).split(' ');
        const date = new Date(timestamp).toLocaleDateString();

        if (!dateMap.has(date)) {
          dateMap.set(date, { high: 0, low: 0 });
        }

        if (status === 'HIGH') {
          dateMap.get(date)!.high += 1;
        } else if (status === 'LOW') {
          dateMap.get(date)!.low += 1;
        }
      });

      const labels = Array.from(dateMap.keys());
      const highValues = labels.map(label => dateMap.get(label)!.high);
      const lowValues = labels.map(label => dateMap.get(label)!.low);

      this.chartHistoriqueCapteurdepluieData = {
        labels: labels,
        datasets: [
          {
            label: 'HIGH Events',
            data: highValues,
            borderColor: 'red',
            backgroundColor: 'lightcoral',
            fill: false,
          },
          {
            label: 'LOW Events',
            data: lowValues,
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            fill: false,
          }
        ]
      };

      this.chartHistoriqueCapteurdepluieOptions = {
        responsive: true,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...highValues.concat(lowValues)) + 1,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                return Number.isInteger(value) ? value : '';
              }
            }
          }
        }
      };

      if (this.chart?.chart) {
        this.chart.chart.update();
      }
      this.initWebSocket();
    });
  }

  getHistoriquePompoOn() {
    this.dataService.getHistoriquePompoOn().subscribe((data) => {

      const entries = Object.entries(data);
      const dateMap = new Map<string, number>();

      entries.forEach(([key, timestamp]) => {
        const date = new Date(timestamp as string).toLocaleDateString();
        if (dateMap.has(date)) {
          dateMap.set(date, dateMap.get(date)! + 1);
        } else {
          dateMap.set(date, 1);
        }
      });

      const labels = Array.from(dateMap.keys());
      const values = Array.from(dateMap.values());

      this.chartHistoriquePompoOnData = {
        labels: labels,
        datasets: [
          {
            label: 'Pompo On Events',
            data: values,
            borderColor: 'green', // Corrected color
            backgroundColor: 'lightblue',
            fill: false,
          }
        ]
      };

      this.chartHistoriquePompoOnOptions = {
        responsive: true,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...values) + 1,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                return Number.isInteger(value) ? value : '';
              }
            }
          }
        }
      };

      if (this.chart?.chart) {
        this.chart.chart.update();
      }
      this.initWebSocket();
    });
  }

  getHistoriquePompoOff() {
    this.dataService.getHistoriquePompoOff().subscribe((data) => {

      const entries = Object.entries(data);
      const dateMap = new Map<string, number>();

      entries.forEach(([key, timestamp]) => {
        const date = new Date(timestamp as string).toLocaleDateString();
        if (dateMap.has(date)) {
          dateMap.set(date, dateMap.get(date)! + 1);
        } else {
          dateMap.set(date, 1);
        }
      });

      const labels = Array.from(dateMap.keys());
      const values = Array.from(dateMap.values());

      this.chartHistoriquePompoOffData = {
        labels: labels,
        datasets: [
          {
            label: 'Pompo Off Events',
            data: values,
            borderColor: 'red', // Use a different color
            backgroundColor: 'lightcoral',
            fill: false,
          }
        ]
      };

      this.chartHistoriquePompoOffOptions = {
        responsive: true,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...values) + 1,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                return Number.isInteger(value) ? value : '';
              }
            }
          }
        }
      };

      if (this.chart?.chart) {
        this.chart.chart.update();
      }
      this.initWebSocket();
    });
  }

  private initWebSocket(): void {
    this.webSocketService.getSocket().subscribe((message) => {
      console.log(message)
      if (message.getHistoriquePompoOn !== undefined) {
        this.getSatistiquePompe = message.getHistoriquePompoOn;
        console.log("getSatistiquePompe", this.getSatistiquePompe);
        this.getHistoriquePompoOn();
        this.cdr.detectChanges();
      }
      if (message.getHistoriquePompoOff !== undefined) {
        this.getSatistiquePompe = message.getHistoriquePompoOff;
        console.log("getSatistiquePompe", this.getSatistiquePompe);
        this.getHistoriquePompoOff();
        this.cdr.detectChanges();
      }

      if (message.getHistoriqueCapteurdepluie !== undefined) {
        this.getHistoriqueCapteurdepluiechart = message.getHistoriqueCapteurdepluie;
        console.log("getSatistiquePompe", this.getHistoriqueCapteurdepluiechart);
        this.getHistoriqueCapteurdepluie();
        this.cdr.detectChanges();
      }

      if (message.getHistoriqueWaterNiveauSensor !== undefined) {
        //  this.getHistoriqueCapteurdepluiechart = message.getHistoriqueWaterNiveauSensor;
        //   console.log("getSatistiquePompe", this.getHistoriqueCapteurdepluiechart);
        this.getHistoriqueWaterNiveauSensor();

        this.cdr.detectChanges();
      }


      if (message.getHistoriquePompewithcondiitons !== undefined) {
        //  this.getHistoriqueCapteurdepluiechart = message.getHistoriqueWaterNiveauSensor;
        //   console.log("getSatistiquePompe", this.getHistoriqueCapteurdepluiechart);
        this.getHistoriquePompewithcondiitons();

        this.cdr.detectChanges();
      }


      // Add WebSocket subscription for Pompo Off here if needed
    });
  }

  logout() {
    this.router.navigate(['signin']);
    this.authenticationService.logout().subscribe();
  }

  getProfile() {
    this.dataService.getProfile().pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.router.navigate(['/signin']);
        } else {
          console.error('An error occurred:', error);
        }
        return throwError(error);
      })
    ).subscribe((Profiledata) => {
      this.nom = Profiledata.nom;
      console.log(this.nom);
    });
  }
}