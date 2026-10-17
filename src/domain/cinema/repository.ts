import type { MovieSession, Seat } from "./entity";

export interface CinemaRepository{
    getAllSessions():Promise<MovieSession[]>,
    getSessionById(id: number):Promise<MovieSession|null>,
    getBookedSeats(sessionId: number):Promise<MovieSession|null>,
    bookSeat(seatId: number, sessionId: number):Promise<void>
}
