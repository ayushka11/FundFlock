export enum PAYOUT_STATUS {
  PENDING = 1,
  SUCCESS = 3,
  FAILED = 2,
  REVERSED = 4,
  PENDING_APPROVAL = 5,
  REJECTED = 6,
};

export const PAYOUT_REQUEST_PARAM = {
  FROM_DATE: 'from',
  TO_DATE: 'to',
  PAGE: 'page',
  LIMIT: 'limit',
  STATUS: 'status',
  TRANSFER_ID: 'transferId',
  VENDOR:'vendor',
  AMOUNT:'amount'
};

export const PAYOUT_HOOK_EVENT_NAME = {
  TRANSFER_SUCCESS: 'TRANSFER_SUCCESS',
  TRANSFER_FAILED: 'TRANSFER_FAILED',
  TRANSFER_REVERSED: 'TRANSFER_REVERSED',
  TRANSFER_PENDING: 'TRANSFER_PENDING',
  VIRTUAL_ACCOUNT_THRESHOLD_BREACHED: 'VIRTUAL_ACCOUNT_THRESHOLD_BREACHED',
  CIRCUIT_BREAKER: 'CIRCUIT_BREAKER',
};


export const DEFAULT_PAYOUT_CONSTANT = {
  NAME_VALIDATION_REQUIRED : false,
  PAYOUT_MODE: 1,
  UPI_PAYOUT_MODE: 2,
  DEFAULT_IFSC_STATE : 'KARNATAKA',
  PAYOUT_LABEL: 'Withdrawal'

}

export const PAYOUT_TYPE = {
  INSTANT: 'instant',
  MANUAL: 'manual'
}

export const PAYOUT_KAFKA_TOPIC = {
  PAYOUT_SUCCESS : 'apollo-payoutSuccess'
}

export const TRANSACTION_STATUS_NAME_MAP= {
  initiated: 'Initiated',
  pending: 'Pending',
  success: 'Successful',
  failed: 'Failed',
  pending_approval: 'Pending',
  rejected: 'Failed',
}

export const PAYOUT_BENEFICIARY_TYPE = {
  BANK: 2,
  UPI: 3
}

export const PAYOUT_MODE = {
  IMPS: 'IMPS',
  UPI: 'UPI'
}

export const PAYOUT_INSTRUMENT_DOWNTIME_STATUS = {
  DOWN: 'DOWN',
  FLUCTUATE:'FLUCTUATE',
  UP:'UP'
}

export const PAYOUT_MODE_FOR_EVENTS = {
  1: "BANK",
  2: "UPI"
}

export const UPI_SPLITTER = '@'

export const SPLIT_UPI_LENGTH = 2;

export const MAX_BENEFICIARY_REJECTED_ACCOUNTS = 2;

export const PAYOUT_DOWNTIME_SEVERITY = {
  HIGH:"downtime",
  MODERATE:"fluctuate"
}