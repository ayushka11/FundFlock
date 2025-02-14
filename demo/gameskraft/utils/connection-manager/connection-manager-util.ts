import Config, {SocketNamespaceConfig, SocketRedisConfig } from './../../config/config';
import ConnectionManager from 'connection-manager'
import { IServerOptions } from 'connection-manager/lib/socketio-manager/types';
import LoggerUtil, { ILogger } from '../logger';
import { ClientEventsMap } from "./client-event-map";
import SocketListenEvents from '../../models/enums/socket-listen-events';
import SocketMessageTracingDecorator from '../monitoring/socket-message-tracing-decorator';

const logger: ILogger = LoggerUtil.get("ConnectionManagerUtil");

/* ConnectionManagerUtil -- It exposes callbacks to tether(connection-manager) for listening on
   userevents and gives wrapper function to send message to a socket channel, user and peers;
*/

export default class ConnectionManagerUtil {
    private static _clientEventsMap: ClientEventsMap;
    private static connectionManager: ConnectionManager;

    private static _namespace: SocketNamespaceConfig;

    public static get namespace(): SocketNamespaceConfig {
        return ConnectionManagerUtil._namespace;
    }

    public static set namespace(value: SocketNamespaceConfig) {
        ConnectionManagerUtil._namespace = value;
    }

    private static _redisConfig: SocketRedisConfig;

    public static get redisConfig(): any {
        return ConnectionManagerUtil._redisConfig;
    }

    public static set redisConfig(value: SocketRedisConfig) {
        ConnectionManagerUtil._redisConfig = value;
    }

    private static _serverOptions: IServerOptions;

    public static get serverOptions(): any {
        return ConnectionManagerUtil._serverOptions;
    }

    public static set serverOptions(value: IServerOptions) {
        ConnectionManagerUtil._serverOptions = value;
    }

    private static _socketMiddleware: any;

    public static get socketMiddleware(): any {
        return ConnectionManagerUtil._socketMiddleware;
    }

    public static set socketMiddleware(value: any) {
        ConnectionManagerUtil._socketMiddleware = value;
    }

    public static init() {
        try {
            if (
                ConnectionManagerUtil._namespace &&
                ConnectionManagerUtil._clientEventsMap &&
                ConnectionManagerUtil._serverOptions &&
                ConnectionManagerUtil._redisConfig
            ) {
                logger.info(`Created Socket Server with clientEventMap -  ${JSON.stringify(ConnectionManagerUtil._clientEventsMap)} 
				serverOption - ${JSON.stringify(ConnectionManagerUtil._serverOptions)}  redisConfig - ${JSON.stringify(ConnectionManagerUtil._redisConfig)}  socketMiddleware - ${JSON.stringify(ConnectionManagerUtil._socketMiddleware)} `);

                const namespaceArray: Array<string | RegExp> = [ConnectionManagerUtil._namespace.gateway]
                const namespaceClientEventMap: Map<string | RegExp, ClientEventsMap> = new Map<string | RegExp, ClientEventsMap>()
                namespaceClientEventMap.set(ConnectionManagerUtil._namespace.gateway, ConnectionManagerUtil._clientEventsMap)
                ConnectionManagerUtil.connectionManager = new ConnectionManager(
                    namespaceArray,
                    namespaceClientEventMap,
                    ConnectionManagerUtil._redisConfig,
                    ConnectionManagerUtil._serverOptions,
                    LoggerUtil.get("ConnectionManager"),
                    ConnectionManagerUtil._socketMiddleware
                );

            }
            else {
                throw 'Missing param for initialisation';
            }
        } catch (error) {
            logger.error(`Error in creating socket server -- error :: `, error);
        }
    }

    public static startSocketServer(startNewSocketServer: boolean) {
        ConnectionManagerUtil.connectionManager.listen(startNewSocketServer);
    }

    /* Constructs a map of socket events to which server is listeneing and there relevant callback function*/

    public static constructClientEventsMaps(events: any) {

        let clientEventsMap: ClientEventsMap = {};
        logger.info(events, `events`)
        for (let event in events) {
            clientEventsMap = {
                ...clientEventsMap,
                [events[event]]: ConnectionManagerUtil.handleClientEvents,
            };
        }
        logger.info(clientEventsMap, `Created ClientEventMaps `);
        ConnectionManagerUtil._clientEventsMap = clientEventsMap;
    }

    public static async handleClientEvents(
        eventName: string,
        userId: string,
        namespace: string,
        payload?: any,
    ): Promise<void> {
        try {
            logger.info(`Recieved Socket Message -- ${eventName} for user - ${userId} payload ${payload}`);
            // add the handler here
            switch (eventName) {
                case SocketListenEvents.CONNECT:
                    logger.info(`in connect`)
                    break;
                case SocketListenEvents.DISCONNECT:
                    break;
            }
        } catch (error) {
            logger.error(`Error in handling socket event error :: `, error);
            throw error;
        }
    }

    @SocketMessageTracingDecorator
    public static async sendMessageToUser(
        eventName: string,
        userId: number,
        payload: any,
        namespace: string,
    ): Promise<void> {
        try {
            logger.info(`Sending socket message -- ${eventName} to userId - ${userId} payload - ${JSON.stringify(payload)} namespace - ${namespace}`);
            await ConnectionManagerUtil.connectionManager.eventDispatcher.sendMessageToClient(
                eventName,
                payload,
                `${userId}`,
                namespace
            );
        } catch (error) {
            logger.error(`Error in sending socket message -- ${eventName} for userId - ${userId} -- error :: `, error);
        }
    }

    public static async shutDown() {
        logger.info('Shut Down Request')
        await ConnectionManagerUtil.connectionManager.shutDown()
        logger.info('Shut Down Request completed')
    }

}
