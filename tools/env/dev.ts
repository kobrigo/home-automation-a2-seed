import { EnvConfig } from './env-config.interface';

const DevConfig: EnvConfig = {
  ENV: 'DEV',
  SOCKET_IO_URL: 'http://localhost:4001'
};

export = DevConfig;

