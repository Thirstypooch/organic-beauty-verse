package com.thirstypooch.data

import com.thirstypooch.models.*
import io.github.cdimascio.dotenv.dotenv
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.math.BigDecimal

object DatabaseFactory {
    fun init() {
        val dotenv = dotenv()
        val driverClassName = "org.postgresql.Driver"
        val jdbcURL = dotenv["DB_URL"]
        val user = dotenv["DB_USER"]
        val password = dotenv["DB_PASSWORD"]
        val database = Database.connect(jdbcURL, driver = driverClassName, user = user, password = password)

        transaction(database) {
            addLogger(StdOutSqlLogger)

            // 1. Create schemas if they don't exist
            SchemaUtils.create(Categories, Products)

            // 2. Seed Categories (only if empty)
            if (Categories.selectAll().count() == 0L) {
                Categories.batchInsert(
                    listOf(
                        Triple("Facial", "Effective skincare solutions for your face", "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=500"),
                        Triple("Masajes", "Relaxing massage oils and body products", "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=500"),
                        Triple("Limpieza Facial", "Deep cleansing products for facial care", "https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=500"),
                        Triple("Corporal", "Complete body care products", "https://images.unsplash.com/photo-1570194065650-d99fb4abbd47?q=80&w=500"),
                        Triple("Cabello", "Hair care products for all hair types", "https://images.unsplash.com/photo-1595476108003-e467c597eca6?q=80&w=500")
                    )
                ) { (name, description, imageUrl) ->
                    this[Categories.name] = name
                    this[Categories.description] = description
                    this[Categories.imageUrl] = imageUrl
                }
                println("✅ Categories seeded.")
            }

            // 3. Seed Products from JSON (only if empty)
            if (Products.selectAll().count() == 0L) {
                println("Attempting to seed products from JSON...")

                // Create a map of category names to their DB IDs
                val categoryMap = Categories.selectAll().associate { it[Categories.name] to it[Categories.id] }

                // Configure the JSON parser
                val jsonParser = Json { ignoreUnknownKeys = true }

                // Load the JSON file from the resources folder
                val jsonText = this::class.java.getResource("/products.json")?.readText()
                    ?: error("Cannot find products.json in resources.")

                // Parse the JSON text into a list of DTOs
                val productsFromJson = jsonParser.decodeFromString<List<ProductJsonDto>>(jsonText)

                // Insert the data into the database
                Products.batchInsert(productsFromJson) { productDto ->
                    this[Products.externalId] = productDto.externalId
                    this[Products.name] = productDto.name
                    this[Products.price] = BigDecimal(productDto.price) // Convert String to BigDecimal
                    this[Products.description] = productDto.description
                    this[Products.categoryId] = categoryMap[productDto.category]
                        ?: error("Category '${productDto.category}' not found in database for product '${productDto.name}'.")
                    this[Products.howToUse] = productDto.howToUse
                    this[Products.warnings] = productDto.warnings
                    this[Products.imageUrl] = productDto.imageUrl
                }
                println("✅ ${productsFromJson.size} products seeded successfully from JSON.")
            }
        }
    }
}