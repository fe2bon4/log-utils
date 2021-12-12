import { Format, TransformableInfo } from 'logform';

export type TimestampTypes = 'numeric' | 'utc' | 'locale';

export interface TimestampOpts {
  type: TimestampTypes;
}

class Timestamp implements Format {
  opts: TimestampOpts = {
    type: 'numeric',
  };

  constructor(opts?: Partial<TimestampOpts>) {
    if (opts) {
      this.opts = { ...this.opts, ...opts };
    }
  }
  transform = (info: TransformableInfo) => {
    const { type } = this.opts;
    const date = new Date();

    const timestamp =
      type == 'locale'
        ? date.toLocaleString()
        : type === 'utc'
        ? date.toISOString()
        : date.getTime();

    return {
      ...info,
      timestamp,
    };
  };
}

export default Timestamp;
