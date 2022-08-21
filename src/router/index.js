import {createRouter, createWebHistory} from 'vue-router'
import UserLogin from '../components/user/UserLogin.vue'
import NotFound from "../views/NotFound.vue"
import UserIndex from "../components/user/UserIndex.vue"
import UserRegister from "../views/UserRegister.vue"
import UserPage from "../views/UserPage.vue"

import InitHome from "../views/InitHome.vue"
import UserPurchaseQuery from "../views/PurchaseQuery.vue"
import UserTradeQuery from "../views/TradeQuery.vue"
import UserMoneyManage from "../views/MoneyManage.vue"
import regist from "../views/regist.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/user/login',
            name: 'UserLogin',
            component: UserLogin
        },
        {
            path: '/user/register',
            name: 'UserRegister',
            component: UserRegister
        },
        {
            path: '/user/:account',
            name: "UserPage",
            component: UserPage,
            children: [
                {
                    path: 'index',
                    name: 'UserIndex',
                    component: UserIndex
                },
                {
                    path: 'information',
                    name: 'UserInformation',
                    component: () => import('../components/user/UserInformation.vue')
                },
                {
                    path: 'privilege',
                    name: 'UserPrivilege',
                    component: () => import('../components/user/UserPrivilege.vue')
                }
            ]
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound
        },
        {
            path: '/',
            name: "InitHome",
            component: InitHome
        },
        {
            path: '/user/:account/purchase',
            name: "PurchaseQuery",
            component: UserPurchaseQuery
        },
        {
            path: '/user/:account/trade',
            name: "TradeQuery",
            component: UserTradeQuery
        },
        {
            path: '/user/:account/charge',
            name: 'MoneyManage',
            component: UserMoneyManage
        },
        {
            path: '/user/regist',
            name: 'Regist',
            component: regist
        }
    ]
})

export default router
