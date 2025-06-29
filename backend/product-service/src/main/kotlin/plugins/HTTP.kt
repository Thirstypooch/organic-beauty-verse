package com.thirstypooch.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*

fun Application.configureHTTP() {
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowHeader(HttpHeaders.Authorization)
        anyHost() // For development, we allow any host. For production, you would restrict this.
    }
}