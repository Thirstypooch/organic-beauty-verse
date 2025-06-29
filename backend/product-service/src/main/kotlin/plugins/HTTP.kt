package com.thirstypooch.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*

fun Application.configureHTTP() {
    install(CORS) {
        anyHost() // For development. In production, you would list your frontend's domain.
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowMethod(HttpMethod.Options) // Essential for pre-flight requests
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
    }
}