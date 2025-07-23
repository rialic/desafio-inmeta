import type { RouteRecordRaw } from 'vue-router'

export default [
    {
        path: '/home',
        name: 'private.home',
        component: () => import('layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'private.cards',
                component: () => import('pages/CardListPage.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'cartao/:id',
                name: 'private.cards-form',
                component: () => import('src/pages/CardFormPage.vue'),
                props: (route) => ({ id: route.params.id }),
                meta: { requiresAuth: true }
            }
        ]
    }
] as RouteRecordRaw[]