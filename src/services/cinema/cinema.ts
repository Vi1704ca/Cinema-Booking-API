import type { CinemaRepository } from "../../domain/cinema/repository.js";
import type { CinemaService } from "./cinema.types.js";
import { formatSessions, formatSeats } from "../../transport/dto/response.js";



export function createCinemaService(cinemaRepository: CinemaRepository): CinemaService {
    return {
        async getAllSessions() {
            const sessions = await cinemaRepository.getAllSessions()
            return formatSessions(sessions)
        },

        async getSessionById(id: number) {
            const session = await cinemaRepository.getSessionById(id)
            if (!session) return null
            return { id: session.id, movieTitle: session.movieTitle, startsAt: session.startsAt }
        },

        async getSessionSeats(sessionId: number) {
            const seats = await cinemaRepository.getSessionSeats(sessionId)
            if (!seats) return null
            return formatSeats(seats)
        },

        async bookSeat(sessionId: number, seatId: number) {
            const session = await cinemaRepository.getSessionById(sessionId)
            if (!session) return { success: false, status: 404 }

            const seats = await cinemaRepository.getSessionSeats(sessionId)
            const seat = seats?.find((candidate) => candidate.id === seatId)
            if (!seat) return { success: false, status: 404 }
            if (seat.booked) return { success: false, status: 409 }

            await cinemaRepository.bookSeat(seatId, sessionId)
            return { success: true, status: 200 }
        }
    };
}