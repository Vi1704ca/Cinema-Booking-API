export interface MovieSession{
    id: number
    movieTitle: string
    startsAt: Date
    seats: Seat[]
}

export interface Seat{
    id: number
    row: number 
    number: number
    movieSessions: MovieSession[]
}