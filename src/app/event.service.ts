import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { PublicGoalVm}from './models/publicGoalVm';
import "rxjs";

@Injectable()
export class EventService {

  constructor(
    private af:AngularFire,     
  ) { }

  generatePublicGoals(eventId: string){
    this.af.database.list("/public-goals").subscribe(publicGoals =>{
      return publicGoals.forEach(pg => {
        var goalRef = this.af.database.object('/events/' + eventId + "/public-goals/" + pg.$key);

        goalRef.set({
          isComplete:false,
          text:pg.name || pg.text,//Might want to do replacement on this too.
          pointValue: pg.points
         });        
      });
    });
  }

  generateSecretGoals(eventId : string){
    let eventPlayersNames = this.getEventPlayerNames();

    //Todo: randomize order.  Can we do that with keys?  Maybe change this to an array without lookup names.
    this.af.database.list('/private-goals').subscribe(privateGoals => {
      return privateGoals.forEach(pg =>{
        var goalRef = this.af.database.object('/events/' + eventId + "/private-goals/" + pg.$key);
        var text = this.replaceText(pg.name || pg.text, eventPlayersNames);
        goalRef.set({
          isComplete:false,
          text:text,
          isDrawn: false,
          sequence:Math.floor(Math.random() * (100)),
          pointValue:pg.points
        })
      })
    })
  }

  //maybe this needs to go to its own engine.
  replaceText(text : string, playerNames:string[]){    
    var newText = text;

    function getRandomPlayerName(){
      var index = Math.floor(Math.random() * playerNames.length);
      return playerNames[index];
    }

    newText = newText.replace("{Random_Player}", getRandomPlayerName)

    return newText;
  }

  //Todo: get this from the players in the event.
  getEventPlayerNames(){
    return ['Shane','David','Josh', 'Luke','Cody', 'Carl', 'Jojo', 'Jake', 'Alex E', 'Alex L', 'Brian']
  }

  initializeEvent(eventId :string){
    //reset player scores.
    //remove existing goals.
    this.generatePublicGoals(eventId);
    this.generateSecretGoals(eventId);
    //store initialization date.
  }

  getLimboGoals(playerId:string, eventId: string){
    var privateGoals = this.af.database.list('/events/' + eventId +"/players/" + playerId + "/private-goals/", 
    {
      query:{
        orderByChild: 'inLimbo',
        equalTo:true
      }
    });
    return privateGoals;
  }

  drawPrivateGoals(playerId:string, eventId: string){
    //assign 3 goals to the player.  They can choose to discard after seeing them.
      var privateGoals = this.af.database.list('/events/' + eventId + "/private-goals", {
        query: {
          orderByChild: 'sequence',
          limitToFirst:3
        }
      });
      return privateGoals;
  }
  discardPrivateGoal(privateGoalId : string, playerId: string, eventId: string){
    //remove private goal from player.
    var playerList = this.af.database.object('/events/' + eventId +"/players/" + playerId + "/private-goals/" + privateGoalId).remove();
    var eventPG = this.af.database.object('/events/' + eventId + "/private-goals/" + privateGoalId);
    eventPG.take(1).subscribe(g => {
      g.isDrawn = false;
      g.sequence = g.sequence -500//put on bottom of deck basically above the cards that are currently in peoples hands.
      eventPG.set(g);
    });
  }

  setPrivateGoalToComplete(privateGoalId : string, playerId: string, eventId: string, pointValue:number) {
    var scoreRef = this.af.database.object('/events/' + eventId +"/players/" + playerId + "/score");
    scoreRef.take(1).subscribe(score => {
      scoreRef.set(pointValue + Number.parseInt(score.$value))
    });
    this.af.database.object('/events/' + eventId +"/players/" + playerId + "/private-goals/" + privateGoalId + '/isComplete').set(true);
  }

  getEventPublicGoalVms(eventId: string){
    return this.af.database.list('/events/' + eventId + '/public-goals').map(goals =>{
      return goals.map(goal => {
        let goalVm = new PublicGoalVm();
        goalVm.isComplete = goal.isComplete;
        goalVm.pointValue = goal.pointValue;
        goalVm.text = goal.text;
        goalVm.id = goal.$key;
        this.af.database.object('/players/' + goal.playerId).subscribe(p => {
          goalVm.completedPlayerName = p.name;
        });
        return goalVm;
      });
    });
  }

  setPublicGoalToComplete(publicGoalId : string, playerId: string, eventId: string, pointValue:number) {
    var scoreRef = this.af.database.object('/events/' + eventId +"/players/" + playerId + "/score");
    scoreRef.take(1).subscribe(score => {
      scoreRef.set(pointValue + Number.parseInt(score.$value))
    });
    var playerPublicGoalsRef = this.af.database.object('/events/' + eventId +"/players/" + playerId + "/public-goals/" + publicGoalId)
    playerPublicGoalsRef.set(0);
    var publicGoal = this.af.database.object('/events/' + eventId + "/public-goals/" + publicGoalId);
    publicGoal.take(1).subscribe(g => {
      g.isComplete = true;
      g.playerId = playerId;
      publicGoal.set(g);
    });
  }
}
