import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../players.service';
import { EventService } from '../event.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  userId:string;
  playerId:string;
  player:FirebaseObjectObservable<any>;
  constructor(private af : AngularFire, private ps : PlayersService) {
    af.auth.subscribe(auth =>{
      this.userId = auth.uid;
      af.database.object('/user-player/' + this.userId).subscribe(playerId => {
        this.playerId = playerId.$value;
        this.player = ps.getPlayer(this.playerId)
      });        
    });
  }

  saveName(text:string){
    this.player.update({ name: text });
  }

  saveTagline(text:string){
    this.player.update({ tagline: text });
  }

  ngOnInit() {
  }

}
