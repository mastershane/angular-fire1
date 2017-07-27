import { Component } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, AngularFireAuth } from 'angularfire2';
import {PlayersService} from "app/players.service";
import {EventService} from "app/event.service";
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PlayersService, EventService]
})
export class AppComponent {

  showAdmin : boolean;

  constructor(private af: AngularFire, private router : Router) {
    af.auth.subscribe(auth => {
      this.showAdmin = false;
      if(auth.uid){
        this.af.database.object('/user-player/' + auth.uid).take(1).subscribe(up => {
          if(!up.$value){
            //bring user to player edit page
          }else{
            this.af.database.object('/players/' + up.$value).take(1).subscribe(player =>{
              this.showAdmin = player.isAdmin;
            })
          }
        });
      }else{
        this.router.navigate(['/events'])
      }
    });
  }

  login(playerName : string) {
    this.af.auth.login()
  }

  logout() {
     this.af.auth.logout();
     this.router.navigate(['/leaderboard'])
  }
}
