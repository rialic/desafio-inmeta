import type { Card } from "./cardTypes"

export type User = {
    id: string,
    name: string
}

export type TradeCard = {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    type: string,
}

export type TradeCardRequests = {
    id: string
    user: User
    createdAt: string
    card?: Card
    tradeCards: TradeCard[]
}