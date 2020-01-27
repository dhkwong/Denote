import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginUser: any;
  registerUser: any;
  constructor(private _httpService: HttpService,
     private _route: ActivatedRoute,
     private _router: Router, ) { }

  ngOnInit() {
    //may not need this with the form method used at hand,  if I'm 
    this.loginUser = { username: "", password: "" }
    console.log("hi");
    console.log(this.loginUser);
  }
  login(loginFormData) {

    console.log("login data" + loginFormData.value);
    console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password);
    this._httpService.loginUser(this.loginUser[0].username, this.loginUser.password).subscribe(data => {
      console.log(data);
      this._router.navigate(['/home']);
    })
  }

}
