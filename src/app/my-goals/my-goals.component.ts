import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../players.service';
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
  constructor(af : AngularFire, ps : PlayersService) {
    this.activeEvent = af.database.object('/active-event');
    this.activeEvent.subscribe(value => {
      this.currentEventId = value.$value;
      af.auth.subscribe(auth =>{
        this.userId = auth.uid;
        af.database.object('/user-player/' + this.userId).subscribe(playerId => {
          this.eventPlayer = ps.getEventPlayer(this.currentEventId, playerId.$value)
        })        
      });
    });

  }


  ngOnInit() {
  }

}
