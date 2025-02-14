import { IPolicy } from "../models/concordia/policy";

export default class ConcordiaUtil {

    static getIsMigrationPolicy(migrationPolicies: Array<number>,policyId: number,policies: Array<IPolicy>): boolean {
        const currentPolicy: number[] = migrationPolicies.filter(policy => policy == policyId);
        const availablePolicy: Array<IPolicy> = policies.filter(policy => policy.policyId == policyId);
        return currentPolicy.length> 0 && availablePolicy.length > 0;
    }
}