import Transport, { TransportStreamOptions } from 'winston-transport';

interface ConsoleTransportOptions {
  transport_opts?: TransportStreamOptions;
  application_name: string;
}

class ConsoleTransport extends Transport {
  private application_name: string;
  constructor({
    transport_opts = {},
    application_name = 'random-app',
  }: ConsoleTransportOptions) {
    super(transport_opts ?? {});

    this.application_name = application_name;
    this.on('console:log', this.commit);
  }

  commit = ({ timestamp = new Date().getTime(), level, ...rest }: any) => {
    console.log(
      new Date(timestamp).toLocaleString(),
      `[${this.application_name}]`,
      level,
      rest
    );
  };

  log(info: any, callback: () => void) {
    this.emit('console:log', info);
    callback();
  }
}

export default ConsoleTransport;
