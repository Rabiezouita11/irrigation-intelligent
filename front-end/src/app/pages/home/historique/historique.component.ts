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
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective; // Optional chaining
 // chart chartHistoriquePompoOnData

 chartHistoriquePompoOnData!: ChartData<'line'>;
 chartHistoriquePompoOnOptions!: ChartOptions<'line'>;
  nom: any;
  currentUserEmail!: string | null;
  getSatistiquePompe: any;

  constructor(private weatherService: WeatherService ,private userService: UserService, private webSocketService: WebSocketService, private httpClient: HttpClient,
    private cdr: ChangeDetectorRef, private dataService: DataService, private ScriptServiceService: ScriptService,
    private renderer: Renderer2, private zone: NgZone // Inject NgZone here
    , private authenticationService: AuthenticationService, private router: Router, private toastrService: ToastrService,


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

  }

  getHistoriquePompoOn() {
    this.dataService.getHistoriquePompoOn().subscribe((data) => {
      console.log('Historique Pompo On Data:', data);
  
      // Convert the object to an array of entries
      const entries = Object.entries(data);
  
      // Prepare a map to aggregate occurrences by date
      const dateMap = new Map<string, number>();
  
      // Aggregate occurrences by date
      entries.forEach(([key, timestamp]) => {
        const date = new Date(timestamp as string).toLocaleDateString(); // Format date (e.g., "MM/DD/YYYY")
        console.log(timestamp)
        if (dateMap.has(date)) {
          dateMap.set(date, dateMap.get(date)! + 1); // Increment count
        } else {
          dateMap.set(date, 1); // Initialize count
        }
      });
  
      // Prepare labels and values for the chart
      const labels = Array.from(dateMap.keys());
      const values = Array.from(dateMap.values());
  
      // Prepare chart data
      this.chartHistoriquePompoOnData = {
        labels: labels,
        datasets: [
          {
            label: 'Pompo On Events',
            data: values,
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            fill: false,
          }
        ]
      };
  
      // Prepare chart options
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
            suggestedMax: Math.max(...values) + 1, // Adjust based on data
            ticks: {
              stepSize: 1, // Ensure tick marks are at whole numbers
              callback: function(value) {
                // Display only integer values
                return Number.isInteger(value) ? value : '';
              }
            }
          }
        }
      };
  
      // Update the chart if it's already rendered
      if (this.chart?.chart) {
        this.chart.chart.update();
      }
      this.initWebSocket();
    });
  }
  
  
  private initWebSocket(): void {
    this.webSocketService.getSocket().subscribe((message) => {


      if (message.getHistoriquePompoOn !== undefined) {
        this.getSatistiquePompe = message.getHistoriquePompoOn;
        console.log("getSatistiquePompe",this.getSatistiquePompe)
        this.getHistoriquePompoOn();
        this.cdr.detectChanges(); // Consider if this is necessary
      }




    });
  }


  logout() {
    this.router.navigate(['signin']);

    this.authenticationService.logout()
      .subscribe();
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

}
