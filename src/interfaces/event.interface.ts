export interface EventDto {
  latitude: string,
  longitude: string,
  speed: string,
  battary: string,
  GPSLogger: string
  timestamp: string,

  username: string
}


export interface EventDb {
  id: number;
  user: string;
  battary: number;
  speed: number;
  long: number;
  lat: number;
  time: Date;
  year: number;
  month: number;
  day: number;
  hour: number;
  createdAt: Date;
}


export interface EventToEmit extends Pick<EventDb, "user" | "battary" | "speed" | "long" | "lat" | "time"> {
  numberOfAllRecivedEvents: number
} 