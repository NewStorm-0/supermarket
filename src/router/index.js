import {createRouter, createWebHistory} from 'vue-router'
import UserLogin from '../views/UserLogin.vue'
import NotFound from "../views/NotFound.vue"
import UserIndex from "../components/user/UserIndex.vue"
import UserRegister from "../views/UserRegister.vue"
import UserPage from "../views/UserPage.vue"
import InitHome from "../views/InitHome.vue"

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
                },
                {
                    path: 'coupon',
                    name: 'UserCoupon',
                    component: () => import('../components/user/UserCoupon.vue')
                },
                {
                    path: 'redeem',
                    name: 'UserRedeem',
                    component: () => import('../components/user/UserRedeem.vue')
                },
                {
                    path: 'order',
                    name: 'UserOrder',
                    component: () => import('../components/user/UserOrder.vue')
                },
                {
                    path: 'bill_details',
                    name: 'UserBillDetails',
                    component: () => import('../components/user/UserBillDetails.vue')
                },
                {
                    path: 'commodity',
                    name: 'UserCommodity',
                    component: () => import('../components/user/UserCommodity.vue')
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
            path: '/administrator/login',
            name: 'AdminLogin',
            component: () => import('../views/AdminLogin.vue')
        },
        {
            path: '/administrator',
            name: 'AdminPage',
            component: () => import('../views/AdminPage.vue'),
            children: [
                {
                    path: 'index',
                    name: 'AdminIndex',
                    component: () => import('../components/administrator/AdminIndex.vue')
                },
                {
                    path: 'user_management',
                    name: 'AdminUserManagement',
                    component: () => import('../components/administrator/AdminUserManagement.vue')
                }
            ]
        }
    ]
})

export default router
