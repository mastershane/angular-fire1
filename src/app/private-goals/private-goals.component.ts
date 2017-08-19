import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'app-private-goals',
  templateUrl: './private-goals.component.html',
  styleUrls: ['./private-goals.component.css'],
})
export class PrivateGoalsComponent implements OnInit {

  privateGoals: FirebaseListObservable<any>;
  constructor(af : AngularFire) {
    this.privateGoals = af.database.list('/private-goals');
  }

  addPrivateGoal(name : string, points : number){
    this.privateGoals.push({name:name, points:points});
  }

  updateGoal(key:string, text:string, pointValue:number){
    this.privateGoals.update(key, {name : text, points:pointValue});
  }

  deleteGoal(key:string){
    this.privateGoals.remove(key);
  }

  ngOnInit() {
  }

}