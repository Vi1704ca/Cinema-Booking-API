import type { MovieSession, SeatAvailability } from "../domain/cinema/entity.js";
import type { CinemaRepository } from "../domain/cinema/repository.js";
import { isStructuredError } from "@prisma/orm-postgres/utils";
import { db } from "../prisma/db.js";

export type DatabaseType = typeof db;

export function createCinemaRepository(db: DatabaseType): CinemaRepository {
    return {
        async getAllSessions() {
            return db.orm.public.MovieSession.select("id", "movieTitle", "startsAt")
                .orderBy((session) => session.startsAt.asc())
                .all();
        },
        async getSessionById(id: number) {
            const session = await db.orm.public.MovieSession
                .select("id", "movieTitle", "startsAt")
                .first({ id });
            return session;
        },
        async getSessionSeats(sessionId: number) {
            const session = await db.orm.public.MovieSession
                .include("seats", (seat) => seat.select("id"))
                .first({ id: sessionId });

            if (!session) {
                return null;
            }

            const bookedSeatIds = new Set(session.seats.map((seat) => seat.id));
            const seats = await db.orm.public.Seat.select("id", "row", "number").all();
            const availability: SeatAvailability[] = seats.map((seat) => ({
                ...seat,
                booked: bookedSeatIds.has(seat.id),
            }));

            return availability.sort((left, right) => left.row - right.row || left.number - right.number);
        },
        async bookSeat(seatId: number, sessionId: number) {
            try {
                await db.orm.public.MovieSessionSeat.create({
                    MovieSessionId: sessionId,
                    SeatId: seatId,
                });
            } catch (error) {
                if (error instanceof Error && "sqlState" in error && error.sqlState === "23505") {
                    throw new Error("SEAT_ALREADY_RESERVED");
                }

                if (isStructuredError(error) && error.code === "ORM.RELATION_ROW_MISSING") {
                    throw new Error("SESSION_OR_SEAT_NOT_FOUND");
                }

                throw error;
            }
        },
    };
}