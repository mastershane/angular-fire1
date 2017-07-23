import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import "rxjs";


@Injectable()
export class PublicGoalsService {

  constructor(private af: AngularFire) { }

  addPublicGoal(name : string, points: number){
    this.getPublicGoals().push({name : name, points :points})
  }

  getPublicGoals(){
    return this.af.database.list("/public-goals");
  }

  // getPublicGoalsForPlayer(playerId: string, eventId: string){
  //   return this.af.database('event/' + eventId + '/players/' + playerId/)
  // }

}
