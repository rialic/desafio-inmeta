export type StoreMethod = 'myCards' | 'index'

export type TradeCard = {
    cardId: string
    type: 'OFFERING' | 'RECEIVING'
}