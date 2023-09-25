import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin.component';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';



const routes: Routes = [
  {
    path: '',
    component: SigninComponent
  }
]

@NgModule({
  declarations: [
    SigninComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
   
  ]
})
export class SigninModule { }
