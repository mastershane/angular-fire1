import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { ItemComponent } from './item/item.component';
import { ItemsComponent } from './items/items.component';
import { ItemsQueryComponent } from './items-query/items-query.component';

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

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    ItemsComponent,
    ItemsQueryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
