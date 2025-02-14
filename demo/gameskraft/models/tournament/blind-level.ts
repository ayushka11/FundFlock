export default interface BlindLevel {
  level?: number;
  smallBlind?: number;
  bigBlind?: number;
  ante?: number;
  turnTime?: number;
  timeBank?: number;
  timeBankRenew?: number;
  disconnectTime?: number;
  reconnectTime?: number;  
}