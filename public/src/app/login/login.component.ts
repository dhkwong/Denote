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
    console.log("login data username: " + form.value.username)
    console.log("login data password: " + form.value.password)
    let formvalue = form.value;
    // console.log("formvalue: "+ form)

    // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
    this._httpService.loginUser(formvalue)
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
  
  register(formvalue: NgForm) {

    console.log("Register Stringify data: " + JSON.stringify(formvalue.value))
    // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
    this._httpService.registerUser(formvalue.value)
      .subscribe(data => {
        if (JSON.stringify(data) == 'false') {
          //if no user found
          console.log('registration failed')
          this._router.navigate(['/login'])
          
        } else {
          //else user found reroute to home
          console.log("register in login.component navigating to /home")
          this._router.navigate(['/home']);
        }
      },
        //if error reroute to login
        error => {
          console.log(JSON.stringify(error.message))
          this._router.navigate(['/login'])
        }

      );
  }

}
