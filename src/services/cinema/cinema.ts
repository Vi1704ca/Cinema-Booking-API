import type { CinemaRepository } from "../../domain/cinema/repository.ts";
import type { CinemaService } from "./cinema.types.ts";
import { formatSessions, formatSeats } from "../../transport/dto/response";



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
            const session = await cinemaRepository.getSessionById(sessionId)
            if (!session) return null
            const bookedSeats = await cinemaRepository.getBookedSeats(sessionId)
            return formatSeats(bookedSeats)
        },

        async bookSeat(sessionId: number, seatId: number) {
            const session = await cinemaRepository.getSessionById(sessionId)
            if (!session) return { success: false, status: 404 }

            if (seatId < 1 || seatId > 6) return { success: false, status: 404 }

            const bookedSeats = await cinemaRepository.getBookedSeats(sessionId)
            const isTaken = bookedSeats.some(s => s.id === seatId)
            if (isTaken) return { success: false, status: 409 }

            await cinemaRepository.bookSeat(seatId, sessionId)
            return { success: true, status: 200 }
        }
    };
}