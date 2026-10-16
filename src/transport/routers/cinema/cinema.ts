import { Router } from "express";

export function createMovieSessionRouter() {
    const router = Router()

    router.get("/");
    router.get("/:id");

    return router
}