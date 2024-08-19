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

  nom: any;
  currentUserEmail!: string | null;
  getSatistiquePompe: any;

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
  ) {}

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
  }

  getHistoriquePompoOn() {
    this.dataService.getHistoriquePompoOn().subscribe((data) => {
      console.log('Historique Pompo On Data:', data);

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
              callback: function(value) {
                return Number.isInteger(value) ? value : '';
              }
            }
          }
        }
      };

      if (this.chart?.chart) {
        this.chart.chart.update();
      }
    });
  }

  getHistoriquePompoOff() {
    this.dataService.getHistoriquePompoOff().subscribe((data) => {
      console.log('Historique Pompo Off Data:', data);

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
              callback: function(value) {
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
      console.log(message )
      if (message.getHistoriquePompoOn !== undefined) {
        this.getSatistiquePompe = message.getHistoriquePompoOn;
    //    console.log("getSatistiquePompe", this.getSatistiquePompe);
        this.getHistoriquePompoOn();
        this.cdr.detectChanges();
      }
      if (message.getHistoriquePompoOff !== undefined) {
        this.getSatistiquePompe = message.getHistoriquePompoOff;
      //  console.log("getSatistiquePompe", this.getSatistiquePompe);
        this.getHistoriquePompoOff();
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