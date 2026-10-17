export interface MovieSession{
    id: number
    movieTitle: string
    startsAt: Date
    seats: noRelationSeat[]
}

export interface Seat{
    id: number
    row: number 
    number: number
    movieSessions: noRelationMovieSession[]
}

type noRelationSeat = Omit<Seat, "movieSessions">;
type noRelationMovieSession = Omit<MovieSession, "seats">;