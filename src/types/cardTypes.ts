import type { TradeCard } from "./cardsGalleryTypes"

export type Card = {
    id: string
    name: string,
    description?: string,
    imageUrl?: string,
    createdAt: string,
    tradeCards?: TradeCard[]
}