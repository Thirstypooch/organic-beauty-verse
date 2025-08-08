package com.thirstypooch.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
class ProductJsonDto (
    val id: Int,
    @SerialName("external_id")
    val externalId: String,
    val name: String,
    val price: String,
    val description: String,
    val category: String,
    @SerialName("how_to_use")
    val howToUse: String?,
    val warnings: String?,
    @SerialName("image")
    val imageUrl: String?
)