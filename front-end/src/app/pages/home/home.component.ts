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
  "assets/iot.js",
]
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUserEmail!: string | null;
  cultureData: any; // Initialize to null or an appropriate default value

  constructor(private userService: UserService, private webSocketService: WebSocketService, private httpClient: HttpClient,
    private cdr: ChangeDetectorRef, private dataService: DataService, private ScriptServiceService: ScriptService,
    private renderer: Renderer2   , private authenticationService: AuthenticationService,    private router: Router

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
    });
    this.fetchTemperatureAirData();
  }
  fetchTemperatureAirData() {
    this.dataService.getTemperatureAirData().subscribe((initialData) => {
      this.cultureData = initialData;

      // Initialize WebSocket connection to listen for updates
      this.initWebSocket();
    });
  }
  private initWebSocket(): void {
    this.webSocketService.getSocket().subscribe((message) => {
      console.log('Received message from WebSocket:', message);
      if (message.cultureData !== undefined) {
        // Update with the real-time data
        this.cultureData = message.cultureData;

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
