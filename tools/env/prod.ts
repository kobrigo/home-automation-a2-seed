import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  SOCKET_IO_URL: 'http://192.168.1.34:4001'
};

export = ProdConfig;

