import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { RouterModule, Routes } from '@angular/router';
import { PublicGoalsComponent } from './public-goals/public-goals.component';
import { EventsComponent } from './events/events.component';
import { EventComponent } from './event/event.component';
import { PlayersComponent} from './players/players.component';
import { PrivateGoalsComponent } from './private-goals/private-goals.component';
import { MyGoalsComponent } from './my-goals/my-goals.component';
import { DrawGoalsComponent } from './draw-goals/draw-goals.component';
import { EventPublicGoalsComponent } from './event-public-goals/event-public-goals.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import {ArraySortPipe } from "app/pipes/array-sort-pipe";
import {ActiveEventComponent} from './active-event/active-event.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Must export the config
export const firebaseConfig = {
  apiKey: 'AIzaSyC7YprHvVF1jlxdg3jAPQHiE9ZaqP9D7tQ',
  authDomain: 'my-awesome-project-7a71e.firebaseapp.com',
  databaseURL: 'https://my-awesome-project-7a71e.firebaseio.com',
  storageBucket: 'my-awesome-project-7a71e.appspot.com',
  messagingSenderId: '903524844580'
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};

const appRoutes: Routes = [
  { path: '', redirectTo: '/leaderboard', pathMatch: 'full' },
  {
    path: 'leaderboard',
    component: LeaderBoardComponent,
    data: { title: 'Leader Board' }
  },
  {
    path: 'publicgoals',
    component: PublicGoalsComponent,
    data: { title: 'Public Goals' }
  },
  {
    path: 'privategoals',
    component: PrivateGoalsComponent,
    data: { title: 'Private Goals' }
  },
  {
    path: 'events',
    component: EventsComponent,
    data: {title: 'Events'}
  },
  {
    path:'event/:id',
    component:EventComponent,
    data: {title: 'Event'}
  },
  {
    path: 'players',
    component: PlayersComponent,
    data: {title: 'Players'}
  },
  {
    path: 'mygoals',
    component: MyGoalsComponent,
    data: {title: 'Goals'}
  },
  {
    path: 'drawgoals',
    component: DrawGoalsComponent,
    data: {title: 'Draw'}
  }, 
  {
    path: 'eventpublicgoals',
    component: EventPublicGoalsComponent,
    data: {title: 'Public Goals'}
  }, 
  {
    path: 'myprofile',
    component: MyProfileComponent,
    data: {title: 'My Profile'}
  }, 
  {
    path: 'activeevent',
    component: ActiveEventComponent,
    data: {title: 'Event'}
  }, 
];

@NgModule({
  declarations: [
    AppComponent,
    LeaderBoardComponent,
    PublicGoalsComponent,
    EventsComponent,
    EventComponent,
    PrivateGoalsComponent,
    PlayersComponent,
    MyGoalsComponent,
    DrawGoalsComponent,
    EventPublicGoalsComponent,
    MyProfileComponent,
    ActiveEventComponent,
    ArraySortPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(), // Add Bootstrap module here.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
