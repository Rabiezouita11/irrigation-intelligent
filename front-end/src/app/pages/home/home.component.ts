import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/components/navbar/services/data.service';
import { UserService } from 'src/app/components/navbar/services/user.service';
import { WebSocketService } from 'src/app/components/navbar/services/web-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUserEmail!: string | null;
  cultureData: any; // Initialize to null or an appropriate default value

  constructor(private userService: UserService ,private webSocketService: WebSocketService ,  private httpClient: HttpClient,
    private cdr: ChangeDetectorRef,private dataService: DataService) { }

  ngOnInit(): void {
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
}
