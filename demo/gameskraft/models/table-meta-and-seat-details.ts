import CurrencyUtil from '../helpers/currency-util';
import {
  AriesTableConfig, AriesTableMetaData,
  AriesTableMetaAndSeatDetails as AriesTableMetaAndSeatDetails
} from './aries/aries-table-meta-and-seat-details';
import { SeatData, SeatsData } from './aries/seats-data';
import { RoomType } from './enums/room-type';
export default class TableMetaAndSeatDetails {
  id: number;
  roomId: number;
  smallBlindAmount: number;
  bigBlindAmount: number;
  minBuyInAmount: number;
  maxBuyInAmount: number;
  gameType: number;
  gameVariant: string;
  isPractice: boolean;
  ritActive: boolean;
  isTurbo: boolean;
  isTenBB?: boolean;
  maxSeats: number;
  averageStack: number;
  averagePot: number;
  migratedRoom: boolean;
  tableHasEmptySeat: boolean;
  seatsData: SeatsData

  static convertAriesResponse(resp: AriesTableMetaAndSeatDetails): TableMetaAndSeatDetails {
    const tableMetaDetailsAndSeatDetails: TableMetaAndSeatDetails = new TableMetaAndSeatDetails();
    const tableConfig: AriesTableConfig = resp?.tableMeta?.tableConfig;
    const tableMetaData: AriesTableMetaData = resp?.tableMeta?.tableMetaData
    tableMetaDetailsAndSeatDetails.id = resp?.tableId ? resp?.tableId : 0;
    tableMetaDetailsAndSeatDetails.roomId = resp?.roomId ? resp?.roomId : 0;
    tableMetaDetailsAndSeatDetails.smallBlindAmount = tableConfig?.smallBlindAmount ?  CurrencyUtil.getAmountInRupee(tableConfig?.smallBlindAmount): 0;
    tableMetaDetailsAndSeatDetails.bigBlindAmount = tableConfig?.bigBlindAmount ?  CurrencyUtil.getAmountInRupee(tableConfig?.bigBlindAmount): 0;
    tableMetaDetailsAndSeatDetails.minBuyInAmount = tableConfig?.minBuyInAmount ?  CurrencyUtil.getAmountInRupee(tableConfig?.minBuyInAmount): 0;
    tableMetaDetailsAndSeatDetails.maxBuyInAmount = tableConfig?.maxBuyInAmount ? CurrencyUtil.getAmountInRupee(tableConfig?.maxBuyInAmount): 0;
    tableMetaDetailsAndSeatDetails.gameType = tableConfig?.gameType ? tableConfig?.gameType : -1;
    tableMetaDetailsAndSeatDetails.gameVariant = tableConfig?.gameVariant ? tableConfig?.gameVariant : "";
    tableMetaDetailsAndSeatDetails.isPractice = tableConfig?.gameType == RoomType.PRACTICE;
    tableMetaDetailsAndSeatDetails.ritActive = tableConfig?.isRitEnabled ? tableConfig?.isRitEnabled : false;
    tableMetaDetailsAndSeatDetails.isTurbo = tableMetaData?.isTurbo ? tableMetaData?.isTurbo : false;
    tableMetaDetailsAndSeatDetails.maxSeats = tableConfig?.maxNumOfSeats ? tableConfig?.maxNumOfSeats : 0;
    tableMetaDetailsAndSeatDetails.averagePot = resp?.averagePot ? CurrencyUtil.getAmountInRupee(resp.averagePot) : 0;
    tableMetaDetailsAndSeatDetails.isTenBB = tableMetaData?.isTenBB;
    tableMetaDetailsAndSeatDetails.tableHasEmptySeat = resp?.tableHasEmptySeat;
    tableMetaDetailsAndSeatDetails.seatsData = (resp?.seatsData || []).map((seatData: SeatData) => {
      return {
        ...seatData,
        stackValue: CurrencyUtil.getAmountInRupee(seatData?.stackValue || 0),
        stackValueInBB: `${CurrencyUtil.getAmountInRupee(seatData?.stackValue || 0 / tableConfig?.bigBlindAmount)}BB`
      }
    })
    return tableMetaDetailsAndSeatDetails;
  }
}
