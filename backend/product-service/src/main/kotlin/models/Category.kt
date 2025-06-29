package com.thirstypooch.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class Category(val id: Int, val name: String, val description: String)

object Categories : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 128).uniqueIndex()
    val description = varchar("description", 255)

    override val primaryKey = PrimaryKey(id)
}