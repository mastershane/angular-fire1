import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../players.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from "rxjs/Observable";
import { EventPlayerVm } from "app/models/eventPlayer";

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css'],
  providers:[PlayersService]
})
export class LeaderBoardComponent implements OnInit {

  players: Observable<any>;
  playersSrc: Observable<any>;
  thePlayer;
  constructor(private ps : PlayersService) {
    this.players = ps.getEventPlayers("event1");
    this.playersSrc = ps._getPlayers();
    this.thePlayer = ps._getPlayer("Josh")
   }

   addPlayer(playerName :string){
      this.ps.addEventPlayer(playerName, "event1");
   }

   updatePlayerName(playerId : string, playerName: string){
     this.ps.updatePlayerName(playerId, playerName);
   }

  ngOnInit() {  }

}
