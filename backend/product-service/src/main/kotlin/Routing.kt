// in src/main/kotlin/com/thirstypooch/Routing.kt

package com.thirstypooch

import com.thirstypooch.models.Categories
import com.thirstypooch.models.Category
import com.thirstypooch.models.Product
import com.thirstypooch.models.Products
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

// This wildcard import is the key fix. It brings in `selectAll`, `select`, `eq`, etc.
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Product Service is running!")
        }

        // Route to get all products
        get("/api/products") {
            val products = transaction {
                Products.selectAll().map { toProduct(it) }
            }
            call.respond(products)
        }

        // Route to get a single product by ID
        get("/api/products/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, "Invalid ID format")
                return@get
            }

            val product = transaction {
                Products.select { Products.id eq id }.map { toProduct(it) }.singleOrNull()
            }

            if (product != null) {
                call.respond(product)
            } else {
                call.respond(HttpStatusCode.NotFound, "Product not found")
            }
        }

        // Route to get all categories
        get("/api/categories") {
            val categories = transaction {
                Categories.selectAll().map { toCategory(it) }
            }
            call.respond(categories)
        }
    }
}

// Helper functions to map a database row to a data class
private fun toProduct(row: ResultRow): Product =
    Product(
        id = row[Products.id],
        name = row[Products.name],
        price = row[Products.price],
        description = row[Products.description],
        categoryId = row[Products.categoryId],
        howToUse = row[Products.howToUse],
        warnings = row[Products.warnings],
        imageUrl = row[Products.imageUrl]
    )

private fun toCategory(row: ResultRow): Category =
    Category(
        id = row[Categories.id],
        name = row[Categories.name],
        description = row[Categories.description]
    )

// NOTE: The extra curly braces from your original file have been removed here.