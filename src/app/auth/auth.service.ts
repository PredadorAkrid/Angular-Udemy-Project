import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: "root"})

export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;

  getToken(){
    return this.token;
  }

  getAuthTokenListener(){
    return this.authStatusListener.asObservable();
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  constructor(private httpClient: HttpClient, private router: Router){}

  createUser(email:string, password: string){
    const authData: AuthData = {email: email, password: password}

    return this.httpClient.post("http://localhost:3000/api/user/signup", authData ).subscribe(() => {
      this.router.navigate["/"];
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password}

    this.httpClient.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", authData).subscribe(response => {
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        const now = new Date();
        const expiration = new Date(  now.getTime() + expiresInDuration * 1000 );
        console.log(expiration);
        this.saveAuthData(token, expiration, this.userId);

        this.authStatusListener.next(true);
        this.router.navigate(['/'])
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }


  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();
    this.userId =  null;
    clearTimeout(this.tokenTimer);

  }


  getUserId(){
    return this.userId;
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }


  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);

      this.authStatusListener.next(true);
    }
  }
  private saveAuthData(token: string, expirationDate: Date, userId:string) {
    localStorage.setItem('token',token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);


  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");

  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!!token || !expirationDate){
      return;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
