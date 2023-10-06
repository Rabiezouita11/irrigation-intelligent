import { Component, OnInit , Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ScriptService } from 'src/app/script.service';

const SCRIPT_PATH_LIST = [
  "assets/login/js/jquery-3.5.0.min.js",

  "assets/login/js/bootstrap.min.js",
  "assets/login/js/imagesloaded.pkgd.min.js",

  "assets/login/js/jquery.mb.YTPlayer.min.js",
  "assets/login/js/validator.min.js",
  "assets/login/js/main.js",

]

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  form!: FormGroup;
  isLoggingIn = false;
  isRecoveringPassword = false;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private ScriptServiceService: ScriptService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
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

  login() {
    this.isLoggingIn = true;

    this.authenticationService.signIn({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe({
      next: (userCredential) => {
        // Handle successful sign-in here

        // Get the Firebase ID token from the userCredential
        userCredential.user.getIdToken().then((firebaseIdToken: string) => {
          // Store the Firebase ID token in localStorage
          this.authenticationService.storeFirebaseIdToken(firebaseIdToken);

          // Navigate to the 'home' route
      
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        });
      },
      error: (error) => {
        this.isLoggingIn = false;
        console.log(error)
        const errorMessage = this.getCustomErrorMessage(error); // Get custom error message
        this.toastrService.error(errorMessage, 'Login Error', { timeOut: 5000 }); // Display custom error message in a toast


      }
    });
  }


  private getCustomErrorMessage(error: any): string {
    // Handle Firebase authentication errors and return custom error messages
    switch (error.code) {
      case 'auth/user-not-found':
        return 'User not found. Please check your email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.';
      default:
        return 'An error occurred during login. Please try again later.';
    }
  }

  recoverPassword() {
    this.isRecoveringPassword = true;

    this.authenticationService.recoverPassword(
      this.form.value.email
    ).subscribe({
      next: () => {
        this.isRecoveringPassword = false;
        //   this.snackBar.open("You can recover your password in your email account.", "OK", {
        //     duration: 5000
        //   });
        this.toastrService.success('A password reset link has been sent to your email address: ' + this.form.value.email);
      },
      error: error => {
        this.isRecoveringPassword = false;
        // this.snackBar.open(error.message, "OK", {
        //   duration: 5000
        // });
        this.toastrService.error('Email does not exist' +this.form.value.email);

      }
    })
  }
  save() {
    this.toastrService.success('error', 'success')

  }
}
