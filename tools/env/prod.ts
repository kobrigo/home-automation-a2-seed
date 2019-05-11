import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  SOCKET_IO_URL: 'http://10.0.0.2:4001'
};

export = ProdConfig;

