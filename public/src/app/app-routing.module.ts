import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';



const routes: Routes = [
  //if session not created yet, home will redirect to login
{path:'',pathMatch:'full', redirectTo:'home'},
{path:'login', component:LoginComponent},
{path:'home', component: HomeComponent},
{path:'**', component:HomeComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
