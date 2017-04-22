import { Component } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import {PlayersService} from "app/players.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PlayersService]
})
export class AppComponent {
  constructor(public af: AngularFire, private ps : PlayersService) {}

  login(playerName : string) {
    this.af.auth.login();
  }

  logout() {
     this.af.auth.logout();
  }
}
