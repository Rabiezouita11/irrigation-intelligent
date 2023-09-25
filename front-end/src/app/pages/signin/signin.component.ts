import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
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
          this.router.navigate(['home']);
        });
      },
      error: (error) => {
        this.isLoggingIn = false;
        this.toastrService.success(error, 'success', {
          timeOut: 5000,
          progressAnimation: 'increasing',
          progressBar: true,
          positionClass: 'toast-top-right',
        });

      }
    });
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
    },
      error: error => {
        this.isRecoveringPassword = false;
        // this.snackBar.open(error.message, "OK", {
        //   duration: 5000
        // });
      }
    })
  }
  save(){
    this.toastrService.success('error', 'success')

  }
}
