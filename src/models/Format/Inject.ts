import { Format, TransformableInfo } from 'logform';

class FormatInject<T = Record<string, string>> implements Format {
  opts: Record<string, any> = {};

  constructor(opts?: Partial<T>) {
    if (opts) {
      this.opts = { ...this.opts, ...opts };
    }
  }
  transform = (info: TransformableInfo) => {
    return {
      ...info,
      ...this.opts,
    };
  };
}

export default FormatInject;
