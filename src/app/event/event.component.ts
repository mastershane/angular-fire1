import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from "rxjs/Observable";
import { PlayersService } from '../players.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  event:FirebaseObjectObservable<any>;
  players: FirebaseListObservable<any>;
  eventPlayers: Observable<any>;
  eventId: string;
  publicGoals: FirebaseListObservable<any>;
  privateGoals: FirebaseListObservable<any>;

  constructor(
    private af: AngularFire, 
    private activatedRoute: ActivatedRoute,
    private ps : PlayersService,
    private es : EventService,
    private router : Router
  ) { 
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.eventId = params['id'];
        this.event = this.af.database.object('/events/' + this.eventId);
        this.players = this.ps.getPlayers();
        this.eventPlayers = this.ps.getEventPlayers(this.eventId);
        this.publicGoals = this.af.database.list('/events/' + this.eventId + '/public-goals/');
        this.privateGoals = this.af.database.list('/events/' + this.eventId + '/private-goals/');
    });
  }

  addPlayerToEvent(playerId : string){
    this.ps.addPlayerToEvent(playerId, this.eventId);
  }

  initializeEvent(){
    this.es.initializeEvent(this.eventId);
  }

  save(newName : string){
    this.event.set({name:newName});
  }

  delete() {
    this.event.remove();
    this.router.navigate(['/events'])
  }
}
