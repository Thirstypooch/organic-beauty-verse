package com.thirstypooch

import com.thirstypooch.data.DatabaseFactory
import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    DatabaseFactory.init()
    configureHTTP()
    configureSerialization()
    configureRouting()
}
