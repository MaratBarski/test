import {  Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';
import {BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {

  get isConnected(): boolean { return this._isConnected; }
  private _isConnected = false;
  private _isStarted = false;

  public get url(): string { return this._socketUrl; }
  private _socketUrl: string;
  
  private connection: Socket;

  get onMessage(): Observable<any> {
    return this._onMessage.asObservable();
  }
  private _onMessage = new BehaviorSubject<any>({});

  constructor() {}

  ngOnDestroy(): void {
  }

  start(url: string): void {
    if (this._isStarted) { return; }
    this._isStarted = true;
    this._socketUrl = url;
    this.connect();
  }

  private connect(): void {
    if (this.isConnected) { return; }
    console.log(`Connecting on ${this.url}`);
    this.connection = io.connect(this.url) as any;
    this.addEvents();
    this._isConnected = true;
  }

  private addEvents(): void {
    this.connection.removeAllListeners();
    this.connection.on('message', (data) => {
      console.log('Received data from the server', data);
      this._onMessage.next(data);
    });
  }

  private diconnect() {
    if (this.connection) {
      this.connection.disconnect();
    }
    this._isConnected = false;
  }

  ping(): void {
    this.connection.emit('ppp', 'test');
  }
}
