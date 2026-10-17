import type { MovieSession, SeatAvailability } from "../../domain/cinema/entity.js";



export interface MovieSessionResponse {
    id: number
    movieTitle: string
    startsAt: Date
}

export interface SeatResponse {
    id: number
    row: number
    number: number
    booked: boolean
}

export function formatSessions(sessions: MovieSession[]): MovieSessionResponse[] {
    return sessions.map(({ id, movieTitle, startsAt }) => ({ id, movieTitle, startsAt }))
}

export function formatSeats(seats: SeatAvailability[]): SeatResponse[] {
    return seats.map(({ id, row, number, booked }) => ({ id, row, number, booked }))
}