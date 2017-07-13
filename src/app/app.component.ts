import { Component } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import {PlayersService} from "app/players.service";
import {EventService} from "app/event.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PlayersService, EventService]
})
export class AppComponent {
  constructor(public af: AngularFire, private ps : PlayersService, private es: EventService) {}

  login(playerName : string) {
    this.af.auth.login();
  }

  logout() {
     this.af.auth.logout();
  }
}
