import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { PlayersService } from '../players.service';
import { EventService } from '../event.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-draw-goals',
  templateUrl: './draw-goals.component.html',
  styleUrls: ['./draw-goals.component.css']
})
export class DrawGoalsComponent implements OnInit {

  privateGoals: any[];
  currentEventId:string;
  userId:string;
  playerId: string;
  activeEvent : FirebaseObjectObservable<any>;
  constructor(private af : AngularFire, ps : PlayersService, private es: EventService, private router : Router) {
    this.activeEvent = af.database.object('/active-event');
    this.activeEvent.subscribe(value => {
      this.currentEventId = value.$value;
      af.auth.subscribe(auth =>{
        this.userId = auth.uid;
        af.database.object('/user-player/' + this.userId).subscribe(playerId => {
          this.playerId = playerId.$value
          es.drawPrivateGoals(this.playerId, this.currentEventId).take(1).subscribe(privateGoals => {
            this.privateGoals = privateGoals;
            var goalsRef = af.database.list('/events/' + this.currentEventId + "/private-goals");    
            privateGoals.forEach(g => {            
                var playerGoal = af.database.object('/events/' + this.currentEventId +"/players/" + this.playerId + "/private-goals/" + g.$key);
                playerGoal.set({isComplete : 0, inLimbo: 1 });
                g.isDrawn = true;
                g.sequence = g.sequence + 1000;
                goalsRef.update(g.$key, g);
            })  
          });
        })        
      });
    });
  }

  save(){
    //set inlimbo to false on goals in hand.
    this.privateGoals.forEach(pg => {
      if(pg.keep){
        this.af.database.object('/events/' + this.currentEventId +"/players/" + this.playerId + "/private-goals/" + pg.$key+ '/inLimbo').remove();
      }else{
        this.es.discardPrivateGoal(pg.$key, this.playerId, this.currentEventId);
      }
    });
    this.router.navigate(['/mygoals'])
  }


  ngOnInit() {
  }

}
