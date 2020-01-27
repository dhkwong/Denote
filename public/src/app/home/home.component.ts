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
  userId: any;
  notes: any = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService
  ) {}

  ngOnInit() {
    //if already logged in, the node session will have a userid stored to log in. If it doesn't, should just reroute the user to log in
    this._httpService.getUser().subscribe(data => {
      console.log("data: "+data[0]);
      if (data[0].userId == false) {
        this._router.navigate(['/login'])
      } else {
        //store userId to get all notes with pertaining to user
        this.userId = data[0].userId;
      }
    })
  }
  getNotes() {
    this._httpService.getNotes(this.userId).subscribe(data => {
      console.log('got notes in home.component.ts' + data)
      //saves data into array called notes
      this.notes = data;
    })

  }
  addNote() {

  }
  updateNote() {

  }
}
