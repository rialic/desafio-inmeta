import type { RouteRecordRaw } from 'vue-router'
import TradeCardGalleryPage from '@/pages/TradeCardGalleryPage.vue'
import AuthPage from '@/pages/AuthPage.vue'

export default [
    {
        path: '/',
        name: 'guest.cards',
        component: TradeCardGalleryPage
    },
    {
        path: '/login',
        name: 'guest.auth',
        component: AuthPage
    },
] as RouteRecordRaw[]