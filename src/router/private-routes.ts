import type { RouteRecordRaw } from 'vue-router'

export default [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'cartoes',
                name: 'private.cards',
                component: () => import('pages/CardListPage.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'cartoes/:id',
                name: 'private.cards-form',
                component: () => import('pages/CardFormPage.vue'),
                props: (route) => ({ id: route.params.id }),
                meta: { requiresAuth: true }
            },
            {
                path: 'solicitacoes-de-troca',
                name: 'private.trade-cards',
                component: () => import('pages/TradeCardListPage.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'solicitacoes-de-troca/novo',
                name: 'private.trade-cards-form',
                component: () => import('pages/TradeCardFormPage.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'perfil',
                name: 'private.me',
                component: () => import('pages/UserFormPage.vue'),
                meta: { requiresAuth: true }
            }
        ]
    }
] as RouteRecordRaw[]