const dotenv = require('dotenv');
import { env, envBoolean, envNumber, envStringArray } from '../utils/env-util';

let CONF: any;

export interface ZookeeperConfig {
  Url: string;
}

export interface MonitoringConfig {
  Prefix: string;
  Port: number;
  Endpoint: string;
}

export interface HttpServerConfig {
  Port: string;
}

export interface LoggingConfig {
  LogDir: string;
  FileName: string;
  MaxSize: number; // MB
  MaxAge: number; // Days
  LogConsole: boolean;
  LogFile: boolean;
  LogLevel: string;
}

export interface ProducerConfig {
	Brokers: string[];
}

export interface RedisNode {
	port: number;
	host: string;
}

export interface SocketRedisConfig {
	node: RedisNode;
}

export interface SocketNamespaceConfig {
	gateway: string,
}

export default class Config {
  static init(): void {
    dotenv.config();
    CONF = {
      APP_NAME: env('APP_NAME'),
      ENVIRONMENT: env('NODE_ENV'),
      HTTP_SERVER: {
        Port: envNumber('HTTP_SERVER_PORT'),
      },

      MONITORING: {
        Prefix: env('MONITORING_PREFIX'),
        Port: envNumber('MONITORING_PORT'),
        Endpoint: env('MONITORING_ENDPOINT'),
      },

      LOGGING: {
        LogDir: env('LOGGING_DIR'),
        FileName: env('LOGGING_FILE_NAME'),
        MaxSize: env('LOGGING_FILE_MAX_SIZE'),
        MaxAge: env('LOGGING_FILE_MAX_AGE'),
        LogConsole: envBoolean('LOGGING_CONSOLE'),
        LogFile: env('LOGGING_FILE'),
        LogLevel: env('LOGGING_LEVEL'),
      },

      ZOOKEEPER: {
        Url: env('ZK_URL'),
      },

      WHITELIST_LOCAL_URI: env('WHITELIST_LOCAL_URI'),

      PRODUCER: {
				Brokers: envStringArray('PRODUCER_BROKERS'),
			},

      MS_COOKIE_USER: env('MS_COOKIE_USER'),

      SOCKET_NAMESPACE_CONFIG: {
				gateway: env('SOCKET_GATEWAY_CLIENT_NAMESPACE')
			},

      SOCKET_NAMESPACE_UNIQUE_KEY: {
				gatewayUniqueKey: env('SOCKET_GATEWAY_CLIENT_UNIQUE_KEY'),
			},

      SOCKET_SERVER_OPTION: {
				port: envNumber('SOCKET_SERVER_PORT'),
				redisAdapterConfig: {
					pubClient: {
						host: env('SOCKET_REDIS_ADAPTER_NODES').split(':')[0],
						port: Number.parseInt(env('SOCKET_REDIS_ADAPTER_NODES').split(':')[1], 10),
					}
				},
				socketConfig: {
					pingInterval: envNumber('SOCKET_PING_INTERVAL'),
					pingTimeOut: envNumber('SOCKET_PING_TIMEOUT'),
				}
			},

      SOCKET_REDIS_CONFIG: {
				node: {
					host: env('SOCKET_REDIS_HOST'),
					port: envNumber('SOCKET_REDIS_PORT')
				}
			},

    };
  }

  static getAppName(): string {
    return CONF.APP_NAME;
  }

  static isDevEnv(): boolean {
    return CONF.ENVIRONMENT === 'development';
  }

  static getWhitelistLocalUrl(): string {
    return CONF.WHITELIST_LOCAL_URI;
  }

  static getHttpServerConfig(): HttpServerConfig {
    return CONF.HTTP_SERVER;
  }

  static getMonitoringConfig(): MonitoringConfig {
    return CONF.MONITORING;
  }

  static getLoggingConfig(): LoggingConfig {
    return CONF.LOGGING;
  }

  static getZookeeperConfig(): ZookeeperConfig {
    return CONF.ZOOKEEPER;
  }

  static getProducerConfig(): ProducerConfig {
		return CONF.PRODUCER;
	}

  static getMSCookieUser(): string {
    return CONF.MS_COOKIE_USER;
  }

  static getSocketNamespaceUniqueKey(): any {
		return CONF.SOCKET_NAMESPACE_UNIQUE_KEY;
	}


  static getSocketRedisConfig(): SocketRedisConfig {
		return CONF.SOCKET_REDIS_CONFIG
	}

  static getSocketNamespaceConfig(): SocketNamespaceConfig {
		return CONF.SOCKET_NAMESPACE_CONFIG;
	}

  static getSocketServerOption(): any {
		return CONF.SOCKET_SERVER_OPTION
	}
}
