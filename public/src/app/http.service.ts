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
  getNotes(){
    console.log('getting all notes in http service')
    return this._http.get(`/api/notes/all`)//backtick of `` required vs '' due to ES6 template interpolation for the string interpolation used here

  }
  getNote(reminderid:any){
    console.log('getting one note in http service')
    return this._http.get(`/api/notes/${reminderid}`)
  }
  //could also simply pass it all as a single form variable like with login and register user
  createNote(reminder:any, userId:any){
    console.log('creating note in http service')
    return this._http.post(`/api/notes/${userId}`,reminder)
  }
  editNote(reminder:any, noteid:any){
    console.log('updating note in http service')
    return this._http.put(`/api/notes/${noteid}`,reminder)
  }
  deleteNote(noteId:any){
    console.log('deleting Note in httpService')
    return this._http.delete(`/api/notes/${noteId}`)
  }
  //retrieves stored userID 
  getUser(){ 
    console.log('retrieving user in http service');
    return this._http.get(`/api/notes/user`)
  }

  loginUser(form:any){
    console.log('logging in user in http service')
    return this._http.post(`/api/notes/user/login`,form)
  }
  registerUser(form:any){
    console.log('registering user in http service');
    return this._http.post(`/api/notes/user/register`, form)
  }
  logout(){
    console.log('logging out in http service');
    return this._http.get(`/api/notes/user/logout`)
  }
}
