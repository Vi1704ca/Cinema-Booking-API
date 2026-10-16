import type { MovieSession, Seat } from "./entity";

export interface CinemaRepository{
    getAllSessions():Promise<MovieSession[]>,
    getSessionById(id: number):Promise<MovieSession>,
    getBookedSeats(sessionId: number):Promise<Seat[]>,
    bookSeat(seatId: number, sessionId: number):Promise<void>
}
