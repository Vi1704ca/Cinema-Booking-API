import type { MovieSession, Seat, noRelationSeat } from "./entity";

export interface CinemaRepository{
    getAllSessions():Promise<MovieSession[]>,
    getSessionById(id: number):Promise<MovieSession|null>,
    getBookedSeats(sessionId: number):Promise<BookedSeat[]|null>,
    bookSeat(seatId: number, sessionId: number):Promise<void>
}

export type SeatIds = Omit<Seat, "movieSessions"| "row" | "number">;
export type BookedSeat = noRelationSeat & {
    booked: boolean
}