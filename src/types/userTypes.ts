export type Card = {
    id: string
    name: string
    description: string
    imageUrl: string
    createdAt: string
}

export type User = {
    id: string
    name: string
    email: string
    cards: Card[]
}
