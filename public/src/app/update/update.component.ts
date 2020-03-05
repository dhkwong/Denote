import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  reminderid:any;
  reminder: any;
  replyerrors:any;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService
    ) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {  //retrieves the parameters from the route
      this.reminder = {noteId:"", reminder:""}
      this.reminderid = params['id']
      this.getNote()
    });
  }

  getNote(){
    this._httpService.getNote(this.reminderid).subscribe(data=>{
      this.reminder = {noteId:data[0].noteid, reminder: data[0].reminder};
      console.log(this.reminder)
    })
  }
  updateNote(form:NgForm){
    var reminder = form.value
    var noteId = form.value.noteid
    this._httpService.editNote(reminder,noteId).subscribe({
      next:()=>{
        this._router.navigate(['/home'])
      },
      error:error=>{
        console.log("updateNote error: "+JSON.stringify(error))
        this.replyerrors = error;
      }
    })
  }
  logout() {
    try {
      const observable = this._httpService.logout()
      observable.subscribe({
        next: data => {
          if (data === true) {
            console.log("logout = true")
            this._router.navigate['/login']
          } else {
            console.log("logout = false")
          }
        }, error: error => {
          console.log("logout error: " + JSON.stringify(error))
          this.replyerrors = error;
        }
      })
    } catch (error) {
      console.log("error logging out: " + JSON.stringify(error))
    }
  }
}
