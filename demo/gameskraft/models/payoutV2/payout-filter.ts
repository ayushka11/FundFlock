/* eslint-disable semi */
export default interface PayoutFilter {
    from?: string
    to?: string,
    payoutId?: string,
    transferId?: string,
    status?: number[],
    page?: number,
    limit?: number
}