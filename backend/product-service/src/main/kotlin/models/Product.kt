package com.thirstypooch.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class Product(
    val id: Int,
    val name: String,
    val price: Double,
    val description: String,
    val categoryId: Int,
    val howToUse: String?,
    val warnings: String?,
    val imageUrl: String
)

object Products : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 255)
    val price = double("price")
    val description = text("description")
    val categoryId = integer("category_id").references(Categories.id)
    val howToUse = text("how_to_use").nullable()
    val warnings = text("warnings").nullable()
    val imageUrl = varchar("image_url", 255)

    override val primaryKey = PrimaryKey(id)
}