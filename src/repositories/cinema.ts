import type { MovieSession, Seat } from "../domain/cinema/entity";
import type { CinemaRepository } from "../domain/cinema/repository";
import { db } from '../prisma/db.js';

export type DatabaseType = typeof db;

export function createCinemaRepository(db: DatabaseType): CinemaRepository {
    return {
        async getAllSessions(){
            const sessions: MovieSession[] = await db.orm.public.MovieSession.all()
            return sessions ;
        },
        async getSessionById(id){

        },
        async getBookedSeats(sessionId){

        },
        async bookSeat(seatId, sessionId){

        }   
    }
}