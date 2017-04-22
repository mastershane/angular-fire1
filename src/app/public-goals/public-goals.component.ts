import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { PublicGoalsService } from '../public-goals.service';

@Component({
  selector: 'app-public-goals',
  templateUrl: './public-goals.component.html',
  styleUrls: ['./public-goals.component.css'],
  providers:[PublicGoalsService]
})
export class PublicGoalsComponent implements OnInit {

  publicGoals: FirebaseListObservable<any>;
  constructor(pgs : PublicGoalsService) {
    this.publicGoals = pgs.getPublicGoals();
  }

  addPublicGoal(name : string, points : number){
    this.publicGoals.push({name:name, points:points});
  }

  ngOnInit() {
  }

}
