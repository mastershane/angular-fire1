import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: FirebaseListObservable<any>;
  constructor(af: AngularFire) {
    this.events = af.database.list('/events');
  }
  addEvent(newName: string) {
    this.events.push({ name: newName });
  }

  ngOnInit() {
  }

}
