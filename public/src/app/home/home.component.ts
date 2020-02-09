import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //save userID
  userId:any;
  notes: any = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService
  ) { }

  ngOnInit() {
    this.userId= {userId:"", username:""};
    this.getUser();
   
  }
  getUser() {
    this._httpService.getUser()
      .subscribe( data => {
       console.log("data length in getUser: "+Object.keys(data).length)
       console.log("data in getUser: "+data)
       //Object.keys(customer).length
        if (Object.keys(data).length === 0) {
          this._router.navigate(['/login'])
        } else {

          // this.userId = data[0].userId;
          console.log("first data: "+JSON.stringify(data))
          this.userId = data;
          console.log("this.userId: "+this.userId.userId);
          

        }
      },
        error => {

          this._router.navigate(['/login'])
          //store userId to get all notes with pertaining to user
        }
      );
  }


  getNotes() {
    this._httpService.getNotes(this.userId)
      .subscribe(data => {
        console.log('got notes in home.component.ts' + data)
        //saves data into array called notes
        this.notes = data;
      },
        error => {
          this._router.navigate(['/login'])
        }
      );

  }
  addNote() {
  }
  deleteNote(){
  }
  updateNote() {

  }
}
