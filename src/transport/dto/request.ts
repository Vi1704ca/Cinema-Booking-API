export interface BookSeatRequest {
    seatId: number
}

export interface BookingData {
    sessionId: number
    seatId: number
}

export function validate(sessionIdStr: string, seatIdNum: number): BookingData | null {
    const sessionId = Number(sessionIdStr)
    if (!sessionId || !seatIdNum || sessionId <= 0 || seatIdNum <= 0 || isNaN(sessionId) || isNaN(seatIdNum)) {
        return null
    }
    return { sessionId, seatId: seatIdNum }
}