import { ChangeDetectorRef, Component, NgZone, OnInit, Renderer2 } from '@angular/core';
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
  nom: any;
  currentUserEmail!: string | null;

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
