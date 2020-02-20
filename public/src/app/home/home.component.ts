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
  replyerrors: any;
  user: any;
  notes: any = [];
  newnote: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService
  ) { }

  ngOnInit() {
    //need this.newnote to match the format and data we want to send as js object to the backend..which I may not need since I just take in the new form as a js object to pass to the api
    this.newnote = { reminder: "", userId: "" };
    //need this.user to match the format of the object passed back from the api when querying the mysql server
    // this.user= {userId:"", username:""};
    this.getUser();
    console.log("this.newnote" + JSON.stringify(this.newnote));
  }
  getUser() {
    this._httpService.getUser()
      .subscribe(data => {
        console.log("data length in getUser: " + Object.keys(data).length)
        console.log("data in getUser: " + JSON.stringify(data))

        //if nothing returns aka no such user
        if (Object.keys(data).length === 0) {
          this._router.navigate(['/login'])
        }
        //if registration is false aka preexisting user
        else if (JSON.stringify(data) === '{"userId":false}') {
          this._router.navigate(['/login'])
        }
        else {
          //else assign userid and name
          console.log("first data: " + JSON.stringify(data))
          this.user = data;
          console.log("this.user" + JSON.stringify(this.user));
          this.newnote.userId = this.user.userId
        }
      },
        error => {

          this._router.navigate(['/login'])
          //store userId to get all notes with pertaining to user
        }
      );
  }


  getNotes() {
    this._httpService.getNotes(this.user)
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
  /*
  //use of observable from rxjs
  addReview(reviewformdata) {

    const observable = this._httpService.editMovie(this.movie, reviewformdata);
    observable.subscribe({
      next: data => { //listens for the next data
        console.log("added movie in addMovie component", data)
        this._router.navigate(['/movie'])
      },
      error: error => {
        console.log("error", error)
        this.replyerrors = error.error;
      }
    })

  }
  */
  addNote(form: NgForm) {
    //or this.newNote.reminder = form.reminder if I wanted to pass all data as one object
    // console.log("addnote form: " + JSON.stringify(form));
    let formvalue = form
    const observable = this._httpService.createNote(formvalue, this.user.userId);
    observable.subscribe(data=>{
      console.log(data);
      // next() {
      //   // this._router.navigate(['/home'])
      // },
      // error: error => {
      //   console.log("addNote error: " + error)
      //   this.replyerrors = error;
      // }
    },error=>{
      console.log("addNote errors: "+error)
    }
    )
  }
  deleteNote(noteId: any) {
    console.log("deleteNote noteId: " + noteId);
    const observable = this._httpService.deleteNote(noteId);
    observable.subscribe({
      next() {
        this._router.navigate(['/home'])
      },
      error: error => {
        console.log("deleteNote error: " + error)
        this.replyerrors = error;
      }

    })
  }
  logout() {
    
    try {
      
      const observable = this._httpService.logout()
      observable.subscribe({
        next: data=>{
          if(data === true){
            console.log("logout = true")
            this._router.navigate['/login']
          } else{
            console.log("logout = false")
          }
        }, error:error=>{
          console.log("logout error: "+ error)
          this.replyerrors=error;
        }
      })
    } catch (error) {
      console.log("error logging out: " + error)
    } 
    // const observable = this._httpService.logout();
    // observable.subscribe({
    //   next(){
    //     console.log("logging out")
    //     this._router.navigate(['/login'])
    //   },
    //   error: error => {
    //     console.log("error logging out: " + error)
    //     this.replyerrors = error;
    //   }
    // })
  }
  // add updateNote in api
  // updateNote(form: NgForm) {
  //   const observable = this._httpService.updateNote(form);
  //   observable.subscribe({
  //     next() {
  //       this._router.navigate(['/home'])

  //     },
  //     error: error => {
  //       this.replyerrors = error;
  //     }
  //   })

  // }

}
