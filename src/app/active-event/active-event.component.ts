import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from "rxjs/Observable";
import { PlayersService } from '../players.service';
import { EventService } from '../event.service';
import { EventPlayerVm, GoalVm }from '../models/eventPlayer';

@Component({
  selector: 'app-active-event',
  templateUrl: './active-event.component.html',
  styleUrls: ['./active-event.component.css']
})
export class ActiveEventComponent implements OnInit {

  event:FirebaseObjectObservable<any>;
  eventPlayers:EventPlayerVm[]
  eventId: string;

  constructor(
    private af: AngularFire, 
    private activatedRoute: ActivatedRoute,
    private ps : PlayersService,
    private es : EventService,
    private router : Router
  ) { 
  }

  ngOnInit() {    
    this.af.database.object('/active-event').take(1).subscribe(ae => {
      this.eventId = ae.$value;
      this.ps.getEventPlayersWithAllGoals(this.eventId).take(1).subscribe(eventPlayers =>{
        this.eventPlayers = eventPlayers;
      });
    });
  }

  private generateScores(subtractUnfinishedGoals: boolean){
      this.eventPlayers.forEach(eventPlayerVm => {
        var score = eventPlayerVm.eventPlayer.drinkCount || 0;
        eventPlayerVm.privateGoals.forEach(privateGoal => {
          if(privateGoal.isComplete){
            score += privateGoal.pointValue;
          }else if(subtractUnfinishedGoals){
            score -= privateGoal.pointValue;
          }
        });
        eventPlayerVm.publicGoals.forEach(publicGoal => {
          score += publicGoal.pointValue;
        }); 
        this.af.database.object('/events/' + this.eventId + "/players/" + eventPlayerVm.player.$key +'/score').set(score);   
      });
  }

  generateFinalScores(){
    this.generateScores(true);
  }

  regenerateScores(){
    this.generateScores(false);
  }



}
