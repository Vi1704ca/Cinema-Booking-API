export interface MovieSession{
    id: number
    movieTitle: string
    startsAt: Date
}

export interface Seat{
    id: number
    row: number 
    number: number
}

export interface SeatAvailability extends Seat{
    booked: boolean
}