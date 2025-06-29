// in src/main/kotlin/com/thirstypooch/data/DatabaseFactory.kt

package com.thirstypooch.data

import com.thirstypooch.models.*
import io.github.cdimascio.dotenv.dotenv
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
            // Add logging to see SQL statements in the console
            addLogger(StdOutSqlLogger)

            SchemaUtils.create(Categories, Products)

            // --- Seed Categories ---
            if (Categories.selectAll().count() == 0L) {
                Categories.batchInsert(
                    listOf(
                        "Facial" to "Effective skincare solutions for your face",
                        "Masajes" to "Relaxing massage oils and body products",
                        "Limpieza Facial" to "Deep cleansing products for facial care",
                        "Corporal" to "Complete body care products",
                        "Cabello" to "Hair care products for all hair types"
                    )
                ) { (name, description) ->
                    this[Categories.name] = name
                    this[Categories.description] = description
                }
            }

            // --- Seed Products ---
            if (Products.selectAll().count() == 0L) {
                // Get category IDs to use as foreign keys
                val categoryMap = Categories.selectAll().associate { it[Categories.name] to it[Categories.id] }

                // Products from your SQL file
                val productsToSeed = listOf(
                    Product(id=0, name="Pack Tratamiento Acné", price=24.99, description="Pack Tratamiento Acné; incluye la doble limpieza facial...", categoryId=categoryMap.getValue("Facial"), howToUse="Paso 1 Día - Acné Free Serum...", warnings="Para uso externo...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/pack_tratamiento_acne.jpg"),
                    Product(id=0, name="Gua Sha Piedra Bian", price=18.50, description="Compuesta de piedra Bian (Bian Stone)...", categoryId=categoryMap.getValue("Masajes"), howToUse="Realizar el masaje por 5-15 minutos...", warnings=null, imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/gua_sha.jpg"),
                    Product(id=0, name="Gleam Óleo", price=15.99, description="Sinergia de aceites orgánicos prensados en frío...", categoryId=categoryMap.getValue("Facial"), howToUse="Uso Am/PM. Aplicar 2-4 gotas...", warnings="Para uso externo. Evitar el contacto...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/gleam.jpg"),
                    Product(id=0, name="Aceite de Jojoba", price=12.50, description="Protege de la deshidratación y reduce...", categoryId=categoryMap.getValue("Facial"), howToUse=null, warnings="Para uso externo solamente...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/jojoba.jpg"),
                    Product(id=0, name="Red Wine Cleanser", price=17.99, description="Limpiador facial de Vino, tu limpieza...", categoryId=categoryMap.getValue("Limpieza Facial"), howToUse="Doble Limpieza facial en 1 solo producto!...", warnings="Para uso externo. Evitar el contacto...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/red_wine.jpg"),
                    Product(id=0, name="Aloe Berries con Ácido Hialurónico", price=14.75, description="Crema Nutritiva, Hidratante & Humectante...", categoryId=categoryMap.getValue("Corporal"), howToUse="AM / PM. Aplicar una pequeña cantidad...", warnings="Para uso externo. Mantener fuera...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/berries.jpg"),
                    Product(id=0, name="Bloom Tónico Antiaging", price=16.25, description="Tónico Bloom brinda una inmediata hidratación...", categoryId=categoryMap.getValue("Facial"), howToUse="Agitar antes de usar. Rociar y con suaves toques...", warnings="Para uso externo. Evitar el contacto...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/bloom.jpg"),
                    Product(id=0, name="Gleam Óleo Facial", price=19.95, description="Gleam es un blend lleno de vitaminas...", categoryId=categoryMap.getValue("Facial"), howToUse="Aplicar 2-4 gotas del óleo Gleam...", warnings="Descontinuar de ocurrir alguna irritación...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/gleam_oleo_facial.png"),
                    Product(id=0, name="Moon Serum Noche", price=21.50, description="Experiencia transformadora que comienza...", categoryId=categoryMap.getValue("Facial"), howToUse="Uso solo PM. Aplicar 2-3 gotas...", warnings="Para uso externo. Evitar el contacto...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/moon_serum.jpg"),
                    Product(id=0, name="Ojos Si Omega Complex", price=20.75, description="Nutrición especial para la delicada zona...", categoryId=categoryMap.getValue("Facial"), howToUse="Aplicar sobre la piel limpia alrededor...", warnings="Para uso externo. Evitar el contacto...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/ojos_si.jpg"),
                    Product(id=0, name="Serum Ceramidas", price=22.75, description="Sinergia de lípidos para fortalecer...", categoryId=categoryMap.getValue("Facial"), howToUse="Uso AM. Aplicar en el rostro limpio...", warnings=null, imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/serum_ceramidas.jpg"),
                    Product(id=0, name="Summer Days", price=15.25, description="Pantalla Mineral SPF30...", categoryId=categoryMap.getValue("Corporal"), howToUse=null, warnings="Descontinuar su uso en caso de ocurrir...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/summerdays.jpg"),
                    Product(id=0, name="Aloe Maracuyá con Ácido Hialurónico", price=13.99, description="Crema Nutritiva, Hidratante & Humectante...", categoryId=categoryMap.getValue("Corporal"), howToUse="AM / PM. Aplicar una pequeña cantidad...", warnings="Para uso externo. Mantener fuera...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/aloe_maracuya.jpg"),
                    Product(id=0, name="Serum Retinol Noche", price=20.99, description="Con ingredientes potentes escogidos...", categoryId=categoryMap.getValue("Facial"), howToUse="Uso solo PM. Aplicar sobre la piel...", warnings="Para uso externo. Evitar el contacto...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/retinol.jpg"),
                    Product(id=0, name="Acné Free Serum", price=18.95, description="Ideal para pieles sensibles con acné...", categoryId=categoryMap.getValue("Facial"), howToUse="Uso AM / PM. Aplicar sobre la piel...", warnings="Para uso externo. Evitar el contacto...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/acne_free.jpg"),
                    Product(id=0, name="Vita-C Serum", price=21.99, description="Vita-C Serum es un excelente producto...", categoryId=categoryMap.getValue("Facial"), howToUse="Aplicar sobre la piel limpia...", warnings="Para uso externo. Evitar el contacto...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/vitac.jpg"),
                    Product(id=0, name="Centella Asiática Suero", price=19.25, description="Estimula la Microcirculación...", categoryId=categoryMap.getValue("Facial"), howToUse="Uso AM. Aplicar 2-4 gotas...", warnings="Para uso externo solamente...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/centella.jpg"),
                    Product(id=0, name="Desodorante Menta Roll On", price=9.99, description="Ideal para todo tipo de Piel...", categoryId=categoryMap.getValue("Facial"), howToUse="Sobre la piel limpia aplicar...", warnings="Descontinuar de ocurrir alguna irritación...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/rollon_menta.jpg"),
                    Product(id=0, name="1era. Línea Serum Antioxdiante", price=22.50, description="1era Línea es un concentrado Serum...", categoryId=categoryMap.getValue("Facial"), howToUse="Después del rostro limpio aplicar...", warnings="Descontinuar su uso en caso de ocurrir...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/serum_ceramidas.jpg"),
                    Product(id=0, name="Souflé de Mandarinas", price=13.45, description="Elaborada con extractos botánicos...", categoryId=categoryMap.getValue("Corporal"), howToUse="Aplicar solo una pequeña cantidad...", warnings="Para uso externo solamente...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/mandarinas.jpg"),
                    Product(id=0, name="Termo Protector Capilar", price=16.95, description="Protección Térmica Brillo...", categoryId=categoryMap.getValue("Cabello"), howToUse="Rociar en las partes del cabello...", warnings="Para uso externo. Mantener fuera...", imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/termoprotector.jpg"),
                    Product(id=0, name="Crema Nutritiva para Peinar", price=14.99, description="Crema Nutritiva de peinado...", categoryId=categoryMap.getValue("Cabello"), howToUse="Aplicar una pequeña cantidad...", warnings=null, imageUrl="https://youorganicskincare.s3.sa-east-1.amazonaws.com/products/images/crema_nutritiva.jpg")
                )

                Products.batchInsert(productsToSeed) { product ->
                    this[Products.name] = product.name
                    this[Products.price] = product.price
                    this[Products.description] = product.description
                    this[Products.categoryId] = product.categoryId
                    this[Products.howToUse] = product.howToUse
                    this[Products.warnings] = product.warnings
                    this[Products.imageUrl] = product.imageUrl
                }
            }
        }
    }
}