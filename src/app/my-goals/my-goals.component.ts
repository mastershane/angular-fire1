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
  eventId:string;
  userId:string;
  activeEvent : FirebaseObjectObservable<any>;
  playerId:string;

  constructor(af : AngularFire, private ps : PlayersService, private es : EventService) {
    this.activeEvent = af.database.object('/active-event');
    this.activeEvent.subscribe(value => {
      this.eventId = value.$value;
      af.auth.subscribe(auth =>{
        this.userId = auth.uid;
        af.database.object('/user-player/' + this.userId).subscribe(playerId => {
          this.playerId = playerId.$value;
          this.eventPlayer = ps.getEventPlayer(this.eventId, this.playerId )
        })        
      });
    });
  }

  setGoalToComplete(goal){
    this.es.setPrivateGoalToComplete(goal.id, this.playerId, this.eventId, Number.parseInt(goal.pointValue));
  }

  addBeerPoint(){
    this.ps.addBeerPoint(this.playerId, this.eventId);
  }

  removeBeerPoint(){
    this.ps.removeBeerPoint(this.playerId, this.eventId);
  }

  ngOnInit() {
  }

}
