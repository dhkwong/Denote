import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponenet} from './home/home.component';
import {LoginComponent} from './login/login.component';



const routes: Routes = [
{path:'',pathMatch:'full', redirectTo:'home'},
{path:'login', component:LoginComponent},
{path:'home', component: HomeComponenet},
{path:'**', component:HomeComponenet}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
