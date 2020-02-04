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

  constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router, ) { }

  ngOnInit() {
    //may not need this with the form method used at hand,  if I'm 

  }
  
  login(form: NgForm) {


    console.log("Stringify data username: " + form.value.username)
    console.log("Stringify data password: " + form.value.password)


    // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
    this._httpService.loginUser(form.value.username, form.value.password)
    .subscribe(data => {
      if (JSON.stringify(data) === '{"login":false}') {
      console.log("subscribe login data: " + JSON.stringify(data))
      this._router.navigate(['/login'])
      }else{
        console.log("subscribe login data: " + JSON.stringify(data))
        this._router.navigate(['/home'])
      }
    },
    error=>{
      this._router.navigate(['/login']);
    }
    )
  }
  //...may have just done login for register
  register(form: NgForm) {

    console.log("Register Stringify data: " + JSON.stringify(form.value))

    // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
    this._httpService.registerUser(JSON.stringify(form.value.registerusername), JSON.stringify(form.value.registerpassword))
      .subscribe(data => {
        if (JSON.stringify(data) == 'false') {
          //if no user found
          this._router.navigate(['/login'])
        } else {
          //else user found reroute to home
          console.log("angular register stringifydata" + JSON.stringify(data))
          this._router.navigate(['/home']);
        }
      },
        //if error reroute to login
        error => {
          this._router.navigate(['/login']);
        }

      );
  }

}
