import ConcordiaClient from "../clients/concordiaClient";
import { POLICY_ACKNOWLEDGEMENT, POLICY_STATUS_LIST } from "../constants/concordia-constants";
import { IPolicy, IPolicyAcknowledgement } from "../models/concordia/policy";
import { IPolicyFilter } from "../models/concordia/policyFilter";
import { User, UserAcknowledgement } from "../models/zodiac/user";
import ConcordiaUtil from "../utils/concordia-util";
import LoggerUtil, { ILogger } from "../utils/logger";
import MigrationService from "./migrationService";
import ZodiacService from "./zodiacService";

const configService = require('../services/configService');
const logger: ILogger = LoggerUtil.get("ConcordiaService");

export default class ConcordiaService {
    static async getPolicies(restClient: any,policyFilter: IPolicyFilter,vendorId: string): Promise<Array<IPolicy>>{
        try {
            logger.info({policyFilter},' :: fetching policies');
            const policies: Array<IPolicy> = await ConcordiaClient.getPolicies(restClient,policyFilter,vendorId);
            logger.info(policies,' :: got the policies');
            return policies;
        } catch(e){
            throw e;
        }
    }

    static async createAcknowledgement(restClient: any,acknowledgement: UserAcknowledgement,userId: string,vendorId: string){
        try{
            const policyAcknowledgement: IPolicyAcknowledgement = {
                userId,action:POLICY_ACKNOWLEDGEMENT.ACCEPTED//map from a constants file
            }
            logger.info(policyAcknowledgement,' :: creating this acknowledgement');
            const ack = await ConcordiaClient.createAcknowledgement(restClient,policyAcknowledgement,acknowledgement.policyId,vendorId);
            logger.info('got the acknowldegement :: ',ack);
            return ack;
        } catch(e){
            throw e;
        }
    }

    static async getUserMigrationPolicy(restClient: any, userUniqueId: string,userId: string, vendorId: string) {
        try {
            logger.info("got the data for getUserMigrationPolicy", {userUniqueId, vendorId});
            let response: any = {};
            const userStatus: User = await ZodiacService.getUserMigrationInfo(restClient, userUniqueId);
            logger.info("userStatus", userStatus);
            if (userStatus.has_migrated_to_apollo && !userStatus.created_directly_on_apollo) {
                // check if there is any available policy for this user
                // call concordia service with statusList as 1 and keyList as GMZ-MIGRATION if there is a policy implies user ne abhi tkk koi policy pe sign nhi kia hai
                // set the response here with the first policy of the array accordsingly
                // get all the policies with user id as given statusList: 1,keyList: ye shubhang se puch lete
                const statusList: Array<Number> = [POLICY_STATUS_LIST.DEFFERED,POLICY_STATUS_LIST.REJECTED]// no action taken waali comes here
                const policyFilter: IPolicyFilter = {
                    userId,statusList
                }
                const policies: Array<IPolicy> = await this.getPolicies(restClient,policyFilter,vendorId);
                logger.info('got these policies :: ',policies);
                const userAcknowledgements: any[] = await ZodiacService.getAcknowledgements(restClient, userUniqueId);// all the acknowledgements of this user
                logger.info("userAcknowledgements", userAcknowledgements);
                if(policies.length){
                    // this implies there is a policy which the user has not signed
                    const acknowledgements: any[] = userAcknowledgements.filter(ack => ack.policy_id == policies[0].contentMeta.policyId);
                    if(!acknowledgements.length)
                        response = policies[0].contentMeta;
                }
            }
            logger.info(response, `[ConcordiaService] [getUserMigrationPolicy] getUserMigrationPolicy :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ConcordiaService] [getUserMigrationPolicy] received error :: `);
            throw (e);
        }
    }

    static async createUserMigrationAcknowledgement(restClient: any, userUniqueId: any, acknowledgement: UserAcknowledgement,userId: string,vendorId: string) {
        try {
            // instead send it to concordia
            const userAcknowledgement: any = await this.createAcknowledgement(restClient, acknowledgement, userId,vendorId);
            logger.info(userAcknowledgement, `[ConcordiaService] [createUserMigrationAcknowledgement] response :: `);
            // check if the policy acknowledged was a migration policy get the policies from concordia with the acknowledgement as accepted and filter it policyId from concorida and keyList as GMZ-MIGRATION
            // get policy with acknowledgement as statusList pass this to the util file
            const statusList: Array<Number> = [POLICY_STATUS_LIST.ACCEPTED]// no action taken waali comes here
            const policyFilter: IPolicyFilter = {
                userId,statusList
            }
            const policies: Array<IPolicy> = await this.getPolicies(restClient,policyFilter,vendorId);
            const isMigrationPolicy = ConcordiaUtil.getIsMigrationPolicy(configService.getUserPolicy().migrationPolicy,acknowledgement.policyId,policies);
            logger.info(`[ConcordiaService] [createUserMigrationAcknowledgement] response for isMigrationPolicy :: `,isMigrationPolicy);
            if(isMigrationPolicy){
                logger.info("migrating data for the user");
            }
            return {};
        } catch (e) {
            logger.info(e, `[ConcordiaService] [createUserMigrationAcknowledgement] received error :: `);
            throw (e);
        }
    }
}
