import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';
import { ENV } from '../config/env';
import { LoginService } from './login.service';
import { Store } from '@ngrx/store';
import { tokenSelector } from '../../public-api';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {

  public onGetID = new EventEmitter<string>();

  get isConnected(): boolean { return this._isConnected; }
  private _isConnected = false;
  private  _isStarted = false;

  private get url(): string { return ENV.socketUrl; }
  private connection: Socket;
  private _subscriber: Subscription;
  private _id: string;

  constructor(private store: Store<any>) {
    this.start();
  }

  ngOnDestroy(): void {
    this._subscriber.unsubscribe();
  }

  private start(): void {
    if (this._isStarted) { return; }
    this._isStarted = true;
    this.connect();
    this._subscriber = this.store.select(tokenSelector).subscribe(user => {
      if (LoginService.IS_LOGEDIN()) {
        this.connect();
      } else {
        this.diconnect()
      }
    }) as any;
  }

  private connect(): void {

    if (this.isConnected) { return; }
    if (!LoginService.IS_LOGEDIN()) { return; }

    this.connection = io.connect(this.url) as any;
    this.addEvents();
    this._isConnected = true;
  }

  private addEvents(): void {
    this.connection.removeAllListeners();
    this.connection.on('get-id', (id => {
      this._id = id;
      this.onGetID.emit(id);
    }))
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
