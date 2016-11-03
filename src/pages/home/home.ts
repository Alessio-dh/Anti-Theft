import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import {RegisterPage} from '../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public data;
  registerPage = RegisterPage;

  constructor(private http: Http,public nav: NavController) {
    this.data = {};
    this.data.username = '';
    this.data.password = '';
    this.data.response = '';
  }

  submit() {
    var link = 'http://localhost:8888/Anti-Theft/index.php/login/checkLogin';
    var data = JSON.stringify({username: this.data.username,password: this.data.password});

    this.http.post(link, data)
      .subscribe(data => {
        alert(data.text());
        if(data.text() == "1"){
          this.data.response = "You are logged in!";
        }else{
          this.data.response = "Wrong combination";
        }
      }, error => {
        console.log("Oooops!");
      });
  }

}
