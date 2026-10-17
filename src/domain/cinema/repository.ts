import type { MovieSession, SeatAvailability } from "./entity.js";

export interface CinemaRepository{
    getAllSessions():Promise<MovieSession[]>,
    getSessionById(id: number):Promise<MovieSession|null>,
    getSessionSeats(sessionId: number):Promise<SeatAvailability[]|null>,
    bookSeat(seatId: number, sessionId: number):Promise<void>
}
