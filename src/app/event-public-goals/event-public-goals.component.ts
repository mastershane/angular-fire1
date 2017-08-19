import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import "rxjs";
import { PublicGoalVm }from "app/models/publicGoalVm";;
import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../players.service';
import { EventService } from '../event.service';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-event-public-goals',
  templateUrl: './event-public-goals.component.html',
  styleUrls: ['./event-public-goals.component.css']
})
export class EventPublicGoalsComponent implements OnInit {

  publicGoals: Observable<any>
  activeEvent;
  currentEventId: string;
  userId:string;
  playerId:string;
  //All of this stuff needs to go into a service.
  constructor(private es:EventService, private af: AngularFire) {
    this.activeEvent = af.database.object('/active-event');
    this.activeEvent.subscribe(value => {
      this.currentEventId = value.$value;
      af.auth.subscribe(auth =>{
        if(auth && auth.uid){
          this.userId = auth.uid;
          af.database.object('/user-player/' + this.userId).subscribe(playerId => {
            this.playerId = playerId.$value
          });
        }
      });
      this.publicGoals = this.es.getEventPublicGoalVms(this.currentEventId);        
    });
  }

  setGoalToComplete(goal){
    this.es.setPublicGoalToComplete(goal.id, this.playerId, this.currentEventId, Number.parseInt(goal.pointValue));
  }

  ngOnInit() {    
  }

}
