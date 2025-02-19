export interface EventDto {
  latitude: string,
  longitude: string,
  speed: string,
  battary: number,
  GPSLogger: string
  timestamp: string,

  username: string
}


export interface EventDb {
  id: number;
  user: string;
  battary: string;
  speed: string;
  long: string;
  lat: string;
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