import type { MovieSession, Seat } from "../domain/cinema/entity";
import type { CinemaRepository } from "../domain/cinema/repository";
import { isStructuredError } from "@prisma/orm-postgres/utils";
import { db } from '../prisma/db.js';

export type DatabaseType = typeof db;

export function createCinemaRepository(db: DatabaseType): CinemaRepository {
    return {
        async getAllSessions(){
            const sessions: MovieSession[] = await db.orm.public.MovieSession.include("seats", (seat) => seat.select("id", "row", "number").orderBy((seat) => seat.id.asc())).all();
            return sessions ;
        },
        async getSessionById(id){
            const session: MovieSession|null = await db.orm.public.MovieSession.include("seats", (seat) => seat.select("id", "row", "number").orderBy((seat) => seat.id.asc())).first({id : id});
            return session;
        },  
        async getBookedSeats(sessionId){
           const session : MovieSession|null = await db.orm.public.MovieSession.include("seats", (seat) => seat.select("id", "row", "number")).first({ id: sessionId });
           return session;
        },
        async bookSeat(seatId, sessionId){
            try{
                await db.orm.public.MovieSessionSeat.create({
                    MovieSessionId: sessionId,
                    SeatId: seatId
                });
            }
            catch (error){
                if (error instanceof Error && "sqlState" in error) {
                    if (error.sqlState === "23505") {
                    throw new Error("SEAT_ALREADY_RESERVED"); 
                    }
                }

                if (isStructuredError(error) && error.code === "ORM.RELATION_ROW_MISSING") {
                    throw new Error("SESSION_OR_SEAT_NOT_FOUND");
                }
            }
        }   
    }
}