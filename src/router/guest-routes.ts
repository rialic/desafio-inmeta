import type { RouteRecordRaw } from 'vue-router'
import CardsGalleryPage from '@/pages/CardsGalleryPage.vue'
import AuthPage from '@/pages/AuthPage.vue'

export default [
    {
        path: '/',
        name: 'guest.cards',
        component: CardsGalleryPage
    },
    {
        path: '/login',
        name: 'guest.auth',
        component: AuthPage
    },
] as RouteRecordRaw[]