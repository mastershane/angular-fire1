import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { PlayersService } from '../players.service';
import { EventService } from '../event.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from "rxjs/Observable";
import * as _ from 'underscore';

@Component({
  selector: 'app-draw-goals',
  templateUrl: './draw-goals.component.html',
  styleUrls: ['./draw-goals.component.css']
})
export class DrawGoalsComponent implements OnInit {

  privateGoals: any[];
  eventId:string;
  userId:string;
  playerId: string;
  activeEvent : FirebaseObjectObservable<any>;
  validationMessage:string;
  constructor(private af : AngularFire, ps : PlayersService, private es: EventService, private router : Router) {
    this.activeEvent = af.database.object('/active-event');
    this.activeEvent.subscribe(value => {
      this.eventId = value.$value;
      af.auth.subscribe(auth =>{
        this.userId = auth.uid;
        af.database.object('/user-player/' + this.userId).subscribe(playerId => {
          this.playerId = playerId.$value
          this.drawGoals(this.playerId, this.eventId)
        })        
      });
    });
  }

  private drawGoals(playerId: string, eventId:string){
    this.es.getLimboGoals(playerId, eventId).take(1).subscribe(playerPrivateGoals => {
      if(playerPrivateGoals && playerPrivateGoals.length){
        //The player hasn't committed to their previous goals, draw those.
        this.privateGoals = [];
        playerPrivateGoals.forEach( ppg=>{
          this.af.database.object('/events/' + eventId + '/private-goals/' + ppg.$key).take(1).subscribe(pg => this.privateGoals.push(pg));
        });
      }else{
        //Actually draw them from the deck.
        this.es.drawPrivateGoals(playerId, eventId).take(1).subscribe(privateGoals => {
          this.privateGoals = privateGoals;
          var goalsRef = this.af.database.list('/events/' + eventId + "/private-goals");    
          privateGoals.forEach(g => {            
              var playerGoal = this.af.database.object('/events/' + eventId +"/players/" + playerId + "/private-goals/" + g.$key);
              playerGoal.set({isComplete : false, inLimbo: true });
              g.isDrawn = true;
              g.sequence = g.sequence + 1000;
              goalsRef.update(g.$key, g);
          })  
        });
      }
    });
  }

  save(){
    this.validationMessage = "";
    if(_.where(this.privateGoals, {keep : true}).length < 2){
      this.validationMessage = "You must keep at least 2 goals."
      return;
    }
    //set inlimbo to false on goals in hand.
    this.privateGoals.forEach(pg => {
      if(pg.keep){
        this.af.database.object('/events/' + this.eventId +"/players/" + this.playerId + "/private-goals/" + pg.$key+ '/inLimbo').remove();
      }else{
        this.es.discardPrivateGoal(pg.$key, this.playerId, this.eventId);
      }
    });
    this.router.navigate(['/mygoals'])
  }


  ngOnInit() {
  }

}
