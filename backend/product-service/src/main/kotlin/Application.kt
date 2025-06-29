package com.thirstypooch

import com.thirstypooch.data.DatabaseFactory
import com.thirstypooch.plugins.*
import io.github.cdimascio.dotenv.dotenv
import io.ktor.server.application.*

fun main(args: Array<String>) {
    dotenv {
        ignoreIfMissing = true
    }
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    DatabaseFactory.init()
    configureHTTP()
    configureSerialization()
    configureRouting()
}
