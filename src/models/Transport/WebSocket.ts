import Transport, { TransportStreamOptions } from 'winston-transport';
import { SocketOptions, Socket, io } from 'socket.io-client';

interface WebSocketTransportOptions extends SocketOptions {
  transport_opts?: TransportStreamOptions;
  endpoint: string;
  namespace?: string;
  log_event?: string;
}

type WsLogEventType = string;

type WsListenEventMap = Record<string, any>;

type WsEmitEventMap = Record<WsLogEventType, any>;

class WebSocket extends Transport {
  private socket: Socket<WsListenEventMap, WsEmitEventMap>;

  private log_event: string = 'ws:winston';

  private log_event_internal: string = 'module:log';

  constructor({
    transport_opts,
    endpoint,
    ...opts
  }: WebSocketTransportOptions) {
    super(transport_opts);

    this.socket = io(endpoint, opts);

    if (opts.log_event) this.log_event = opts.log_event;

    this.on(this.log_event_internal, this.commit);
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
    this.socket.emit(this.log_event, info);
  };

  log(info: any, callback: () => void) {
    this.emit(this.log_event_internal, info);
    callback();
  }
}

export default WebSocket;
