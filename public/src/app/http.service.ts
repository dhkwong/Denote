import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) {}
  /*  getMovies() {
    console.log("getMovies");
    return this._http.get('/api/movies');
  }
  submitMovie(movie: any) {
    console.log("I'm in submitmovie",movie);
    return this._http.post('/api/movies', movie);
  }
  editMovie(movie, review) { //for inserting reviews
    console.log("I'm adding a review in http.services.ts", movie);
    //review passed into req.body
    return this._http.put(`/api/movies/${movie.movie._id}`, review);
  }
  deleteMovie(movie) {
    console.log("I'm deleting a movie in http.services.ts", movie);
    return this._http.delete(`/api/movies/${movie._id}`);
  }
  findMovie(id:any){
    console.log("I'm retrieving a movie in findMovie: http.service",id);
    return this._http.get(`/api/movies/${id}`);
  }*/
  getNotes(userid:any){
    console.log('getting all notes in http service')
    return this._http.get(`/api/notes/${userid}`)//backtick of `` required vs '' due to ES6 template interpolation for the string interpolation used here

  }
  createNote(reminder:any, userid:any){
    console.log('creating note in http service')
    return this._http.post(`/api/notes,${userid}`,reminder)
  }
  editNote(reminder:any, noteid:any){
    console.log('updating note in http service')
    return this._http.put(`api/notes/${noteid}`,reminder)
  }
  getUser(userid:any){
    console.log('retrieving user in http service')
    return this._http.get(`/api/notes/user/${userid}`)
  }
  createUser(username:any, hashedpass:any){
    console.log('creating user in http service')
    return this._http.post(`/api/notes/user`,username, hashedpass)
  }
}