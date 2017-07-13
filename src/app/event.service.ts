import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
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
          text:pg.name || pg.text//Might want to do replacement on this too.
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
          text:text
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

  //need method to lock event.





}
