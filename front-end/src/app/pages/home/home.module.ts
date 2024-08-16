import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { NavbarModule } from 'src/app/components/navbar/navbar.module';
import { AuthGuard } from 'src/app/auth.guard';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { HistoriqueComponent } from './historique/historique.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'historique',
    component: HistoriqueComponent, canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [
    HomeComponent,
    HistoriqueComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NavbarModule,
    NgChartsModule
  ]
})
export class HomeModule { }
