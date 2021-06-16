import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({

  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  isLoading = false;
  private authStatusSub: Subscription;
  constructor(public authService: AuthService){}
  onLogin(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
  ngOnInit(){
    this.authStatusSub = this.authService.getAuthTokenListener().subscribe(authStatus => {
      this.isLoading = false;
    })
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe()
  }

}
