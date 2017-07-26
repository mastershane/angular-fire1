import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../players.service';
import { EventService } from '../event.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-my-goals',
  templateUrl: './my-goals.component.html',
  styleUrls: ['./my-goals.component.css']
})
export class MyGoalsComponent implements OnInit {

  eventPlayer: Observable<any>;
  currentEventId:string;
  userId:string;
  activeEvent : FirebaseObjectObservable<any>;
  playerId:string;

  constructor(af : AngularFire, ps : PlayersService, private es : EventService) {
    this.activeEvent = af.database.object('/active-event');
    this.activeEvent.subscribe(value => {
      this.currentEventId = value.$value;
      af.auth.subscribe(auth =>{
        this.userId = auth.uid;
        af.database.object('/user-player/' + this.userId).subscribe(playerId => {
          this.playerId = playerId.$value;
          this.eventPlayer = ps.getEventPlayer(this.currentEventId, this.playerId )
        })        
      });
    });

  }

  setGoalToComplete(goal){
    this.es.setPrivateGoalToComplete(goal.id, this.playerId, this.currentEventId, Number.parseInt(goal.pointValue));
  }

  ngOnInit() {
  }

}
