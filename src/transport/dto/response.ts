import type { MovieSession, Seat } from "../../domain/cinema/entity.ts";



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

export function formatSeats(bookedSeats: Seat[]): SeatResponse[] {
    const seats: SeatResponse[] = []
    const bookedIds = new Set(bookedSeats.map(s => s.id))

    let currentId = 1
    for (let row = 1; row <= 2; row++) {
        for (let number = 1; number <= 3; number++) {
        seats.push({
            id: currentId,
            row: row,
            number: number,
            booked: bookedIds.has(currentId)
        })
        currentId++
        }
    }
    return seats
}