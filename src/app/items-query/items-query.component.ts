import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-items-query',
  templateUrl: './items-query.component.html',
  styleUrls: ['./items-query.component.css']
})
export class ItemsQueryComponent{

  items: FirebaseListObservable<any[]>;
  sizeSubject: Subject<any>;
  
  constructor(af: AngularFire) {
    this.sizeSubject = new Subject();
    this.items = af.database.list('/items', {
      query: {
        orderByChild: 'size',
        equalTo: this.sizeSubject
      }
    });
  }
  filterBy(size: string) {
    this.sizeSubject.next(size); 
  }

}
