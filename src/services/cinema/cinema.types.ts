import type { MovieSessionResponse, SeatResponse } from "../../transport/dto/response.ts";



export interface BookingResult {
    success: boolean
    status: number
}

export interface CinemaService {
    getAllSessions(): Promise<MovieSessionResponse[]>
    getSessionById(id: number): Promise<MovieSessionResponse | null>
    getSessionSeats(sessionId: number): Promise<SeatResponse[] | null>
    bookSeat(sessionId: number, seatId: number): Promise<BookingResult>
}