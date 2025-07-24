import type { TradeCard } from "./tradeCardGalleryTypes"

export type Card = {
    id: string
    name: string,
    description?: string,
    imageUrl?: string,
    createdAt: string,
    tradeCards?: TradeCard[]
}