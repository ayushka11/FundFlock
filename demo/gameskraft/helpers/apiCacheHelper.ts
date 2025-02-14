import {v4 as uuid} from 'uuid';
import TitanClient from '../clients/titanClient';
import { CASH_APP, NO_OP, UPI_PACKAGE_NAME_MAP } from '../constants/constants';
import NodeCache from "node-cache";
import titanError from '../errors/titan/titan-error';
import { getApiCacheConfig } from '../services/configService';
import LoggerUtil, { ILogger } from "../utils/logger";
import AriesClient from '../clients/ariesClient';
import TitanTournamentResponse from "../models/tournament/response/tournament-response"
import { RoomResponse as AriesRoomResponse } from "../models/aries/room-response";
import { GroupResponse as AriesGroupResponse } from "../models/aries/group-response";
import { GroupsTables as AriesGroupsTablesResponse } from "../models/aries/groups-tables";
import AriesTournamentType from '../models/tournament/enums/aries-tournament-type';

const configService = require('../services/configService');
const restHelper = require("../helpers/restHelper");
const redisService = require('../services/redisService');
const _ = require('lodash');
const logger: ILogger = LoggerUtil.get("ApiCacheHelper");

let DEFAULT_GET_ROOMS_CACHE_TTL = 60; // TODO think if this is the right value, also needs to think about the zookeeper config
let DEFAULT_GET_TOURNAMENT_CACHE_TTL = 60;
let DEFAULT_GET_GROUPS_CACHE_TTL = 30;
let DEFAULT_GET_GROUP_TABLES_CACHE_TTL = 2;
let DEFAULT_GET_ONLINE_USERS_CACHE_TTL = 60;
let DEFAULT_GET_PRACTICE_APP_ONLINE_USERS_CACHE_TTL = 60;
let DEFAULT_POLL_INTERVAL = 30000;
let DEFAULT_TOURNAMENT_POLL_INTERVAL = 10000;

const defaultCacheValue = {
    paymentDowntimes: [] as any[], // You can replace 'any[]' with the actual type of paymentDowntimes,
    ariesRooms: [] as Array<AriesRoomResponse>,
    ariesPrivateRooms: [] as Array<AriesRoomResponse>,
    gsRooms: [] as Array<AriesRoomResponse>,
    titanTournaments: undefined as Record<number,TitanTournamentResponse>,
    ariesGroups: [] as Array<AriesGroupResponse>,
    ariesGroupsTables: [] as Array<AriesGroupsTablesResponse>,
    onlineUsers: undefined,
    practiceAppOnlineUsers: undefined
}


let __cache = {
    paymentDowntimes: [] as any[], // You can replace 'any[]' with the actual type of paymentDowntimes,
    ariesRooms: [] as Array<AriesRoomResponse>,
    gsRooms: [] as Array<AriesRoomResponse>,
    titanTournaments: {} as Record<number,TitanTournamentResponse>,
    ariesGroups: [] as Array<AriesGroupResponse>,
    ariesGroupsTables: [] as Array<AriesGroupsTablesResponse>,
    onlineUsers: {},
    practiceAppOnlineUsers: {}
};

let gatewayNodeCache: NodeCache;

export function init(): void {
    const requestId = uuid();
    const sessionId = uuid();
    const deviceId = uuid();
    const userIp = '127.0.0.1';
    const appType = CASH_APP;
    const vendorId = '1'
    const userId = 0;

    gatewayNodeCache = new NodeCache({
        useClones: false
    });

    // Dummy request object for cache manager
    const req = {
        requestId,
        internalRestClient: null
    };

    restHelper.initInternalRestClient(req, requestId, sessionId, deviceId, userIp, appType, vendorId);

    let pollers:Map<string,NodeJS.Timeout> = new Map();
    let checkPollerConfigInterval = configService.getApiCacheConfig().checkPollerConfigInterval
    //Every 30 seconds check if polling is enabled
    __startPolling(() => {
        const enablePolling = configService.getApiCacheConfig().enablePolling;
        if (enablePolling) {
            const enableTournamentsPolling = configService.getApiCacheConfig().enableTournamentsPolling;
            const tournamentsKey = getTournamentsCacheKey();
            const refreshTournamentsInterval = configService.getApiCacheConfig().refreshTournamentsInterval;
            if (enableTournamentsPolling) {
                if (!pollers.has(tournamentsKey)) {
                    pollers.set(tournamentsKey,
                      __startPolling(() => {
                          refreshTournaments(req.internalRestClient)
                            .then(NO_OP)
                            .catch(NO_OP)
                      }, refreshTournamentsInterval || DEFAULT_TOURNAMENT_POLL_INTERVAL)
                    );
                }
            } else {
                pollers.delete(tournamentsKey);
                __cache.titanTournaments = undefined;
            }
        } else {
            //Clear all pollers and empty the cache so that once the polling is started we dont give stale data
            (pollers || []).forEach((_value: any, key: any)  => {
                clearInterval(_value);
                pollers.delete(key);
            });
            __cache = defaultCacheValue;

        }
    }, checkPollerConfigInterval || DEFAULT_POLL_INTERVAL);
}

function __startPolling(handler, interval) {
    // First call has to be immediate.
    // This is important in case of process restart on a Live server.
    handler();
    const poller = setInterval(() => {
        handler();
    }, interval);
    return poller;
}

async function refreshTournaments(restClient) {
    try {
        const titanResponse: TitanTournamentResponse[] = await TitanClient.getTournaments(restClient);
        const titanResponseMap: Record<number, TitanTournamentResponse> = {};
        titanResponse.forEach((titanTournament) => {
            titanResponseMap[titanTournament.id] = titanTournament;
        });
        __cache.titanTournaments = titanResponseMap;
    } catch (error: any) {
        logger.error("Error refreshing tournaments", error);
    }
}


export async function getAriesRoomsFromCache(restClient): Promise<Array<AriesRoomResponse>> {
    const roomsKey = getRoomsCacheKey();
    const cachedResponse: Array<AriesRoomResponse> = gatewayNodeCache ? gatewayNodeCache.get(roomsKey): undefined;
    if (configService.getApiCacheConfig().enableCache && cachedResponse) {
        logger.info("getAriesRoomsFromCache: Returning from cache")
        return cachedResponse || [];
    }
    else {
        const ariesResponse = await AriesClient.getRooms(restClient);
        logger.info("getAriesRoomsFromCache: Returning from API")
        gatewayNodeCache.set(roomsKey, ariesResponse, getRoomsCacheTTL());
        return ariesResponse;
    }
}

export async function getTitanTournamentsFromCache(restClient): Promise<Array<TitanTournamentResponse>> {
    const tournamentsKey = getTournamentsCacheKey();
    const cachedResponse = __cache.titanTournaments;
    const enablePolling = configService.getApiCacheConfig().enablePolling;
    const enableTournamentsPolling = configService.getApiCacheConfig().enableTournamentsPolling;
    if (configService.getApiCacheConfig().enableCache && enablePolling && enableTournamentsPolling && cachedResponse) {
        logger.info("getTitanTournamentsFromCache: Returning from cache")
        return Object.values(cachedResponse ||"");
    }
    else {
        const titanResponse = await TitanClient.getTournaments(restClient);
        const titanResponseMap: Record<number, TitanTournamentResponse> = {};
        titanResponse.forEach((titanTournament) => {titanResponseMap[titanTournament.id] = titanTournament;});
        gatewayNodeCache.set(tournamentsKey, titanResponseMap, getTournamentsCacheTTL());
        logger.info("getTitanTournamentsFromCache: Returning from API")
        return titanResponse;
    }
}

export async function getTitanTournamentByIdFromCache(restClient, tournamentId: number): Promise<TitanTournamentResponse | undefined> {
    const tournamentsKey = getTournamentsCacheKey();
    const enablePolling = configService.getApiCacheConfig().enablePolling;
    const enableTournamentsPolling = configService.getApiCacheConfig().enableTournamentsPolling;
    const cachedResponse = __cache.titanTournaments;
    if (configService.getApiCacheConfig().enableCache && enablePolling && enableTournamentsPolling && cachedResponse) {
        if (cachedResponse && cachedResponse.hasOwnProperty(tournamentId)) {
            logger.info("getTitanTournamentByIdFromCache: Returning from cache")
            return cachedResponse[tournamentId];
        }
    }

    // If tournament ID not found in cache, call API
    const titanResponse = await TitanClient.getTournaments(restClient);
    const titanResponseMap: Record<number, TitanTournamentResponse> = {};
    titanResponse.forEach((titanTournament) => { titanResponseMap[titanTournament.id] = titanTournament; });
    gatewayNodeCache.set(tournamentsKey, titanResponseMap, getTournamentsCacheTTL());
    logger.info("getTitanTournamentByIdFromCache: Returning from API")
    return titanResponseMap?.[tournamentId];
}

export async function getChildSattyTournamentfromParent(restClient, tournamentId: number): Promise<TitanTournamentResponse[]> {
    const tournamentsKey = getTournamentsCacheKey();
    const enablePolling = configService.getApiCacheConfig().enablePolling;
    const enableTournamentsPolling = configService.getApiCacheConfig().enableTournamentsPolling;
    const cachedResponse = __cache.titanTournaments;
    if (configService.getApiCacheConfig().enableCache && enablePolling && enableTournamentsPolling && cachedResponse) {
        logger.info("getChildSattyTournamentfromParent: Returning from cache")
        const tournaments: TitanTournamentResponse[] = Object.values(cachedResponse).filter(
            tournament => filterSattyChildTournament(tournament, tournamentId));
        return tournaments;
    }
    else {
        const titanResponse = await TitanClient.getTournaments(restClient);
        logger.info("getChildSattyTournamentfromParent:titanResponse")
        const titanResponseMap: Record<number, TitanTournamentResponse> = {};
        titanResponse.forEach((titanTournament) => {titanResponseMap[titanTournament.id] = titanTournament;});
        gatewayNodeCache.set(tournamentsKey, titanResponseMap, getTournamentsCacheTTL());
        const tournaments: TitanTournamentResponse[] = titanResponse.filter(
            tournament => filterSattyChildTournament(tournament, tournamentId));
        return tournaments;
    }
}

export async function getAriesGroupsFromCache(restClient): Promise<Array<AriesGroupResponse>> {
    const groupsKey = getGroupsCacheKey();
    const cachedResponse: Array<AriesGroupResponse> = gatewayNodeCache ? gatewayNodeCache.get(groupsKey): undefined;
    if (configService.getApiCacheConfig().enableCache && cachedResponse) {
        logger.info("getAriesGroupsFromCache: Returning from cache")
        return cachedResponse;
    }
    else {
        const ariesResponse = await AriesClient.getGroups(restClient);
        logger.info("getAriesGroupsFromCache: Returning from API")
        gatewayNodeCache.set(groupsKey, ariesResponse, getGroupsCacheTTL());
        return ariesResponse;
    }
}

export async function getAriesGroupTablesFromCache(restClient, groupId: number): Promise<AriesGroupsTablesResponse> {
    const groupTablesKey = getGroupTablesCacheKey(groupId);
    const cachedResponse: AriesGroupsTablesResponse = gatewayNodeCache ? gatewayNodeCache.get(groupTablesKey): undefined;
    if (configService.getApiCacheConfig().enableCache && cachedResponse) {
        logger.info("getAriesGroupTablesFromCache: Returning from cache")
        return cachedResponse;
    }
    else {
        const ariesResponse = await AriesClient.getGroupTables(restClient, groupId);
        logger.info("getAriesGroupTablesFromCache: Returning from API")
        gatewayNodeCache.set(groupTablesKey, ariesResponse, getGroupTablesCacheTTL());
        return ariesResponse;
    }
}

export async function getOnlineUsersFromCache(restClient): Promise<any> {
    const onlineUsersKey = getOnlineUsersKey();
    const cachedResponse = gatewayNodeCache ? gatewayNodeCache.get(onlineUsersKey): undefined;
    if (configService.getApiCacheConfig().enableCache && cachedResponse) {
        logger.info("getOnlineUsersFromCache: Returning from cache")
        return cachedResponse;
    }
    else {
        const onlineUsersResponse = await redisService.getOnlineUsersFromRedis();
        logger.info("getOnlineUsersFromCache: Returning from Redis")
        gatewayNodeCache.set(onlineUsersKey, onlineUsersResponse, getOnlineUsersCacheTTl());
        return onlineUsersResponse;
    }
}

export async function getPracticeAppOnlineUsersFromCache(restClient): Promise<any> {
    const practiceOnlineUsersKey = getPracticeOnlineUsersKey();
    const cachedResponse = gatewayNodeCache ? gatewayNodeCache.get(practiceOnlineUsersKey): undefined;
    if (configService.getApiCacheConfig().enableCache && cachedResponse) {
        logger.info("getPracticeAppOnlineUsersFromCache: Returning from cache")
        return cachedResponse;
    }
    else {
        const practiceAppOnlineUsersResponse = await redisService.getPracticeAppOnlineUsersFromRedis();
        logger.info("getPracticeAppOnlineUsersFromCache: Returning from Redis")
        gatewayNodeCache.set(practiceOnlineUsersKey, practiceAppOnlineUsersResponse, getPracticeAppOnlineUsersCacheTTl());
        return practiceAppOnlineUsersResponse;
    }
}

function filterSattyChildTournament(tournament: TitanTournamentResponse, parentTournamentId: number){
    return tournament.parentTournamentId === parentTournamentId && tournament.tournamentType === AriesTournamentType.SATELLITE
}

function getRoomsCacheKey(): string {
    return "rooms";
}

function getTournamentsCacheKey(): string {
    return "tournaments";
}

function getGroupsCacheKey(): string {
    return "groups";
}

function getGroupTablesCacheKey(groupId: number): string {
    return `group-${groupId}-Tables`;
}

function getOnlineUsersKey(): string {
    return "onlineUsers";
}

function getPracticeOnlineUsersKey(): string {
    return "practiceAppOnlineUsers";
}

function getRoomsCacheTTL() {
    return configService.getApiCacheConfig()?.cacheTTL?.roomsCacheTTL || DEFAULT_GET_ROOMS_CACHE_TTL;
}

function getTournamentsCacheTTL() {
    return configService.getApiCacheConfig()?.cacheTTL?.tournamentsCacheTTL || DEFAULT_GET_TOURNAMENT_CACHE_TTL;
}

function getGroupsCacheTTL() {
    return configService.getApiCacheConfig()?.cacheTTL?.groupsCacheTTL || DEFAULT_GET_GROUPS_CACHE_TTL;
}

function getGroupTablesCacheTTL() {
    return configService.getApiCacheConfig()?.cacheTTL?.groupTablesCacheTTL || DEFAULT_GET_GROUP_TABLES_CACHE_TTL;
}

function getOnlineUsersCacheTTl(): string {
    return configService.getApiCacheConfig()?.cacheTTL?.onlineUsersTTL || DEFAULT_GET_ONLINE_USERS_CACHE_TTL;
}

function getPracticeAppOnlineUsersCacheTTl(): string {
    return configService.getApiCacheConfig()?.cacheTTL?.practiceAppOnlineUsersTTL || DEFAULT_GET_PRACTICE_APP_ONLINE_USERS_CACHE_TTL;
}
