import { Component } from '@angular/core';
import {ConnexionService} from './_services/connexion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fil-rouge-angular';
  constructor(private connexionService: ConnexionService) {
  }

  // tslint:disable-next-line:typedef
  logout(){
    this.connexionService.logout();
  }
}
