import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';


import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Users} from '../_modeles';


@Injectable({
  providedIn: 'root'
})
export class ConnexionService {
  private API_URL = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<Users>;
  public currentUser: Observable<Users>;
  constructor(private http: HttpClient, private router: Router) {
    // @ts-ignore
    this.currentUserSubject = new BehaviorSubject<Users>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Users {
    return this.currentUserSubject.value;
  }

  // tslint:disable-next-line:typedef
  login(username: string, password: string) {
    return this.http.post<any>(`${this.API_URL}/login_check`, { username, password })
      .pipe(
        // tslint:disable-next-line:no-shadowed-variable
        map(Users => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(Users));
          this.currentUserSubject.next(Users);
          console.log(Users);
          return Users;
        }));
  }
  // tslint:disable-next-line:typedef
  logout() {
    // remove user from local storage and set current user to null
    setTimeout(() => {
      window.location.reload(true);
      localStorage.removeItem('currentUser');
      localStorage.removeItem(this.currentUserValue.token);
      // @ts-ignore
      this.currentUserSubject.next(null);
    }, 100, this.router.navigate(['/login']));

  }
  // tslint:disable-next-line:typedef
  getMyToken() {
    // tslint:disable-next-line:prefer-const
    let token = this.currentUserValue.token;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const isExpired = helper.isTokenExpired(token);
    const ex = helper.getTokenExpirationDate(`${token}`);
    return decodedToken;
  }
}
