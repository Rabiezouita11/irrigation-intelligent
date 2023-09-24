import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WebSocketserviceService } from '../Service/web-socketservice.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.css'],
})
export class DataDisplayComponent implements OnInit {
  cultureData: any; // Initialize to null or an appropriate default value

  constructor(private webSocketService: WebSocketserviceService ,  private httpClient: HttpClient,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this.httpClient.get('http://localhost:5000/getTemperatureAir').subscribe((initialData) => {
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
