import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io, Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    socket: Socket;

    constructor() {
        this.socket = io('http://localhost:3000');
    }

    onStatusUpdate(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('statusUpdate', (data: any) => {
                observer.next(data);            
            });

            return () => {
                this.socket.off('statusUpdate');
            }
        });
    }
}