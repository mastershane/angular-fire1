import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import "rxjs";
import { EventPlayerVm, GoalVm }from './models/eventPlayer';

@Injectable()
export class PlayersService {

  constructor(private af: AngularFire) { }

  getEventPlayers(eventId : string){
    return this._getEventPlayers(eventId).map(eventPlayers =>{
      return eventPlayers.map(ep => this._getEventPlayerVmForEventPlayer(ep, eventId));
    });
  }

  _getEventPlayerVmForEventPlayer(eventPlayer, eventId: string){
      var eventPlayerVm = new EventPlayerVm()
      eventPlayerVm.eventPlayer = eventPlayer;
      eventPlayerVm.score = eventPlayer.score;
      this.getPlayer(eventPlayer.$key).subscribe(p => {
        eventPlayerVm.player = p;
        eventPlayerVm.name = p.name;
      });
      if(eventPlayer["private-goals"] != null){
        Object.keys(eventPlayer["private-goals"]).forEach(key =>
        {
            var playerGoal =  eventPlayer["private-goals"][key];
            //This makes round trip for each player goal I think.  This could be faster if we just got them all maybe??
            this.af.database.object('/events/' + eventId + '/private-goals/' + key).subscribe(eventGoal =>{
              let goalVm = new GoalVm;
              goalVm.text = eventGoal.text;
              goalVm.isComplete = playerGoal.isComplete;
              goalVm.pointValue = eventGoal.pointValue;
              goalVm.id = key;
              eventPlayerVm.privateGoals.push(goalVm);
            })
        });
      }
      //these are really only the public goals that are complete.
      if(eventPlayer["public-goals"] != null){
        Object.keys(eventPlayer["public-goals"]).forEach(key =>
        {
            var playerGoal =  eventPlayer["public-goals"][key];
            //This makes round trip for each player goal I think.  This might be faster if we just got them all.
            this.af.database.object('/events/' + eventId + '/public-goals/' + key).subscribe(eventGoal =>{
              let goalVm = new GoalVm;
              goalVm.text = eventGoal.text;
              goalVm.isComplete = playerGoal.isComplete;
              goalVm.pointValue = eventGoal.pointValue;
              goalVm.id = key;
              eventPlayerVm.publicGoals.push(goalVm);
            })
        });
      }

      return eventPlayerVm;
  }

  getEventPlayer(eventId : string, playerId: string){
    return this._getEventPlayer(eventId, playerId).map(ep => this._getEventPlayerVmForEventPlayer(ep, eventId))
  }

  addPlayer(name : string){
    return this.getPlayers().push({name : name}).key;
  }

  addEventPlayer(name : string, eventId :string){
    var key = this.addPlayer(name);
    this.addPlayerToEvent(key, eventId);
  }

  addPlayerToEvent(playerId: string, eventId : string){
     this.af.database.object('/events/' + eventId + "/players/" + playerId).set({
       score: 0,
       privateGoals:[],
       publicGoals:[]
     });
  }

  _getEventPlayers(eventId : string){
    return this.af.database.list('/events/' + eventId + "/players");
  }

  _getEventPlayer(eventId : string, playerId: string){
    return this.af.database.object('/events/' + eventId + "/players/" + playerId);
  }

  getPlayers(){
    return this.af.database.list("/players");
  }


  getPlayer(playerId : string){
    return this.af.database.object("/players/" + playerId);
  }

  updatePlayerName(playerId: string, name : string){
    this.getPlayer(playerId).update({ name: name });
  }


  // addPlayer(newName: string) {
  //   this.players.push({ name: newName, score: 0 });
  // }
}
