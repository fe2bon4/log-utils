import Transport, { TransportStreamOptions } from 'winston-transport';
import { SocketOptions, Socket, io } from 'socket.io-client';

interface WebSocketTransportOptions extends SocketOptions {
  transport_opts?: TransportStreamOptions;
  endpoint: string;
  namespace?: string;
}

type WsLogEventType = string;

type WsListenEventMap = Record<string, any>;

type WsEmitEventMap = Record<WsLogEventType, any>;

class WebSocket extends Transport {
  socket: Socket<WsListenEventMap, WsEmitEventMap>;
  constructor({
    transport_opts,
    endpoint,
    ...opts
  }: WebSocketTransportOptions) {
    super(transport_opts);

    this.socket = io(endpoint, opts);

    this.on('console:log', this.commit);
    this.socket.on('connect', this.onSocketConnect);
    this.socket.on('disconnect', this.onSocketDisconnect);
    this.socket.on('connect_error', this.onSocketConnectError);
  }

  onSocketConnect = () => {
    this.log(
      {
        level: 'info',
        message: 'Socket Connected',
      },
      () => {}
    );
  };

  onSocketDisconnect = () => {
    this.log(
      {
        level: 'error',
        message: 'Socket Disconnected',
      },
      () => {}
    );
  };

  onSocketConnectError = (reason: any) => {
    this.log(
      {
        level: 'error',
        message: `Socket Disconnected, ${JSON.stringify(reason)}`,
      },
      () => {}
    );
  };

  commit = (info: any) => {
    this.socket.emit(`ws:winston`, info);
  };

  log(info: any, callback: () => void) {
    this.emit('console:log', info);
    callback();
  }
}

export default WebSocket;
