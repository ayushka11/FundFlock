import { SeatsData } from './seats-data';
import { TableConfig } from './table-config';
import { TableMetaData } from './table-meta-data';


export interface AriesTableConfig {
  maxNumOfSeats: number,
  gameType: number,
  gameVariant: string,
  smallBlindAmount: number,
  bigBlindAmount: number,
  minBuyInAmount: number,
  maxBuyInAmount: number,
  isRitEnabled?: boolean,
  isEvChopEnabled?: boolean,
  isPotOfGoldEnabled?: boolean,
  anteAmount?: number,
}

export  interface AriesTableMetaData {
  isTurbo?: boolean,
  isTenBB?: boolean,
}

export interface AriesTableMetaAndSeatDetails {
  seatsData: SeatsData,
  tableId: number,
  roomId: number,
  tableMeta: {
    tableConfig: AriesTableConfig,
    tableMetaData: AriesTableMetaData
  },
  averagePot: number,
  tableHasEmptySeat: boolean
}
