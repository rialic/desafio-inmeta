export type BasicPaginator = {
    currentPage: number
    hasMore: boolean
    isLoading: boolean
    loadFn(page: number): Promise<void>
}