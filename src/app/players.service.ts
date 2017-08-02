import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import "rxjs";
import { EventPlayerVm, GoalVm }from './models/eventPlayer';

@Injectable()
export class PlayersService {

  constructor(private af: AngularFire) { }

  getEventPlayersWithAllGoals(eventId:string){
    return this._getEventPlayers(eventId).map(eventPlayers =>{
      return eventPlayers.map(ep => this._getEventPlayerVmForEventPlayer(ep, eventId, true));
    });
  }

  getEventPlayers(eventId : string){
    return this._getEventPlayers(eventId).map(eventPlayers =>{
      return eventPlayers.map(ep => this._getEventPlayerVmForEventPlayer(ep, eventId, false));
    });
  }

  _getEventPlayerVmForEventPlayer(eventPlayer, eventId: string, includeAllGoals:boolean){
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
            //don't show limbo goals in the ui.
            if(!includeAllGoals && playerGoal.inLimbo){
              return;
            }
            //This makes round trip for each player goal I think.  This could be faster if we just got them all maybe??
            this.af.database.object('/events/' + eventId + '/private-goals/' + key).subscribe(eventGoal =>{
              let goalVm = new GoalVm;
              goalVm.text = eventGoal.text;
              goalVm.isComplete = playerGoal.isComplete;
              goalVm.pointValue = Number.parseInt(eventGoal.pointValue);
              goalVm.id = key;
              eventPlayerVm.privateGoals.push(goalVm);
            })
        });
      }
      //These arent used in the UI so we aren't getting them for now.
      if(includeAllGoals){
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
                goalVm.pointValue =  Number.parseInt(eventGoal.pointValue);
                goalVm.id = key;
                eventPlayerVm.publicGoals.push(goalVm);
              })
          });
        }
      }
      return eventPlayerVm;
  }

  getEventPlayer(eventId : string, playerId: string){
    return this._getEventPlayer(eventId, playerId).map(ep => this._getEventPlayerVmForEventPlayer(ep, eventId, false))
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

  addBeerPoint(playerId:string, eventId:string){
    var drinksRef = this.af.database.object('/events/' + eventId + "/players/" + playerId+'/drinkCount');
    drinksRef.take(1).subscribe(v => {
      var value = v.$value || 0;
      drinksRef.set(value + 1);
    });
    var pointsRef = this.af.database.object('/events/' + eventId + "/players/" + playerId+'/score');
    pointsRef.take(1).subscribe(v => {
      var value = v.$value || 0;
      pointsRef.set(value + 1);
    });
  }
  removeBeerPoint(playerId:string, eventId:string){
    var drinksRef = this.af.database.object('/events/' + eventId + "/players/" + playerId+'/drinkCount')
    drinksRef.take(1).subscribe(v => {
      var value = v.$value || 0;
      drinksRef.set(value - 1);
    });
    var pointsRef = this.af.database.object('/events/' + eventId + "/players/" + playerId+'/score');
    pointsRef.take(1).subscribe(v => {
      var value = v.$value || 0;
      pointsRef.set(value - 1);
    });
  }


  // addPlayer(newName: string) {
  //   this.players.push({ name: newName, score: 0 });
  // }
}
