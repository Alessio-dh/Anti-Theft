import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  public data;
  constructor(public navCtrl: NavController,private http: Http) {
    this.data = {};
    this.data.username = '';
    this.data.password = '';
    this.data.cpassword = '';
    this.data.email = '';
    this.data.fn = '';
    this.data.response = '';
  }

  createAccount(){
    var link = 'http://localhost:8888/Anti-Theft/index.php/login/registerAccount';
    if (this.data.password == this.data.cpassword){
      var data = JSON.stringify({
        fullname: this.data.fn,
        username: this.data.username,
        password: this.data.password,
        email: this.data.email
        });

      this.http.post(link, data)
        .subscribe(data => {
          alert(data.text());
          if(data.text() == "1"){
            this.data.response = "Your account has been created, you can login at the login page";
          }else{
            this.data.response = "Something went wrong with creating your account ,please try again";
          }
        }, error => {
          console.log("Oooops!");
        });
    }else{
      this.data.response = "The passwords are not matching";
    }
  }

  ionViewDidLoad() {
    console.log('Hello Register Page');
  }

}
