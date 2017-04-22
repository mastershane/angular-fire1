import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import "rxjs";
import { EventPlayerVm }from './models/eventPlayer';

@Injectable()
export class PlayersService {

  constructor(private af: AngularFire) { }

  getEventPlayers(eventId : string){
    return this._getEventPlayers(eventId).map(eventPlayers =>{
      return eventPlayers.map((eventPlayer) => {
          var eventPlayerVm = new EventPlayerVm()
          eventPlayerVm.eventPlayer = eventPlayer;
          this._getPlayer(eventPlayer.$key).subscribe(p => {eventPlayerVm.player = p;});
          return eventPlayerVm;
          // return new EventPlayerVm(eventPlayer, this._getPlayer(eventPlayer.$key));      
        });
    });
  }

  addEventPlayer(name : string, eventId :string){
    var playerKey = this._getPlayers().push({name : name, score :0}).key;
    this.af.database.object('/events/' + eventId + "/players/" + playerKey).set(0);
  }

  _getEventPlayers(eventId : string){
    return this.af.database.list('/events/' + eventId + "/players");
  }

  _getPlayers(){
    return this.af.database.list("/players");
  }


  _getPlayer(playerId : string){
    return this.af.database.object("/players/" + playerId);
  }

  updatePlayerName(playerId: string, name : string){
    this._getPlayer(playerId).update({ name: name });
  }


  // addPlayer(newName: string) {
  //   this.players.push({ name: newName, score: 0 });
  // }
}
