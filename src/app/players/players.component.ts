import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../players.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  players: Observable<any>;
  thePlayer;
  constructor(private ps : PlayersService) {
    this.players = ps.getPlayers();
   }

   addPlayer(playerName :string){
      this.ps.addPlayer(playerName);
   }

   updatePlayerName(playerId : string, playerName: string){
     this.ps.updatePlayerName(playerId, playerName);
   }

  ngOnInit() {  }

}
