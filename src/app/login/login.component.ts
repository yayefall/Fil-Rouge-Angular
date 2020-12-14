import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Users} from '../_modeles';
import {ConnexionService} from '../_services/connexion.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  currentUser: Users;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: ConnexionService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.authenticationService.currentUserValue) {
      this.getToken();

    }

  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });


    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line:typedef
  get f() { return this.loginForm.controls; }

  // tslint:disable-next-line:typedef
  onSubmit() {
    this.submitted = true;


    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
          console.log(this.authenticationService.getMyToken());
        });
  }
  // tslint:disable-next-line:typedef
  getToken(){
    // tslint:disable-next-line:prefer-const
    let token = this.currentUser.token;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const isExpired = helper.isTokenExpired(token);
    const expirationDate = helper.getTokenExpirationDate(token);
    if (decodedToken.roles[0] === 'ROLE_Administrateur'){
      this.router.navigate(['/admin']);
    }

  }

}
