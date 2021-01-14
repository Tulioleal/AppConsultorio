import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Signin } from '../models/sign-in'
import { Signup } from '../models/sign-up'
import { BehaviorSubject } from 'rxjs';

// import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URI_API = 'api/auth' /* para dev */
  // URI_API = 'http://localhost:4000/api/auth' /* para pro */

  selectedUserSignIn : Signin = {
    email: "",
    password: ""
  }

  selectedUserSignUp : Signup = {
    username: "",
    email: "",
    password: ""
  }

  userSignIn: Signin
  userSignUp: Signup

  private MessageSource = new BehaviorSubject<string>('Unauthorized')
  currentMessage = this.MessageSource.asObservable()

  private errorCode = new BehaviorSubject<number>(404)
  currentErrorCode = this.errorCode.asObservable()


  constructor( private http: HttpClient ) { }

  signIn( user: Signin ){

    return this.http.post<any>(this.URI_API + "/signin", user)
  }

  signUp( user: Signup ){

    return this.http.post<any>(this.URI_API + "/signup", user)
  }

  loggedIn(){
    return !!localStorage.getItem('refreshToken')
  }

  logOut(){
    localStorage.removeItem('refreshToken')
  }

  clearForms(){

    this.selectedUserSignIn = {
      email: "",
      password: ""
    }

    this.selectedUserSignUp = {
      username: "",
      email: "",
      password: ""
    }
  }

  changeMessage(message:string, eCode:number){
    this.MessageSource.next(message)
    this.errorCode.next(eCode)
  }
}
