export interface EventDto {
  latitude: string,
  longitude: string,
  speed: string,
  battary: string,
  timestamp: string,
  username: string
}
export interface EventToEmit {
  latitude: number,
  longitude: number,
  batt: string,
  time: string,
  s: string,
  numberOfAllRecivedEvents: number
};
