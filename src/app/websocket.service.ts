import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, Subject} from 'rxjs';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket;

  constructor() {
  }

  connect() {
    // debugger;
    this.socket = io(`${environment.serverUrl}`, {path: `/${environment.wsRoute}/socket.io`}); // ${environment.wsRoute}

    // const observable = new Observable(observer => {
    //   debugger;
    this.socket.on('message', (data) => {
      console.log('Received data from the server', data);
    });
    // });

    // const observer = {
    //   next: (data: Object) => {
    //     debugger;
    //     this.socket.emit('message', JSON.stringify(data));
    //   }
    // };

    // return Subject.create(observer, observable);
  }
}
