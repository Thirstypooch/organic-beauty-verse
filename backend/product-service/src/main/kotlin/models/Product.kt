package com.thirstypooch.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class Product(
    val id: Int,
    val externalId: String?,
    val name: String,
    val price: Double,
    val description: String,
    val categoryId: Int,
    val howToUse: String?,
    val warnings: String?,
    val imageUrl: String?
)

object Products : Table() {
    val id = integer("id").autoIncrement()
    val externalId = varchar("external_id", 50).uniqueIndex().nullable() // Add this
    val name = varchar("name", 255)
    val price = decimal("price", 10, 2) // Change this from double()
    val description = text("description")
    val categoryId = integer("category_id").references(Categories.id)
    val howToUse = text("how_to_use").nullable()
    val warnings = text("warnings").nullable()
    val imageUrl = varchar("image_url", 255).nullable() // Make nullable to be safe

    override val primaryKey = PrimaryKey(id)
}