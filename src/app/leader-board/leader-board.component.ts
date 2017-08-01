import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../players.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from "rxjs/Observable";
import { EventPlayerVm } from "app/models/eventPlayer";
import {ArraySortPipe } from "app/pipes/array-sort-pipe";

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css'],
  providers:[PlayersService],
})
export class LeaderBoardComponent implements OnInit {

  players: Observable<any>;
  eventId: string;
  selectedPlayer:EventPlayerVm

  constructor(private ps : PlayersService, private af : AngularFire) {
    af.database.object('/active-event').subscribe(value => {
      this.eventId = value.$value;
      this.players = ps.getEventPlayers(this.eventId);        
    });
   }



  ngOnInit() {  }

}
