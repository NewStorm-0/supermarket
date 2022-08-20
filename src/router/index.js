import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../components/user/UserLogin.vue'
import NotFound from "../views/NotFound.vue"
import UserHome from "../components/user/UserIndex.vue"
import UserRegister from "../views/UserRegister.vue"
import UserPage from "../views/UserPage.vue"

import InitHome from "../views/InitHome.vue"
import UserPurchaseQuery from "../views/PurchaseQuery.vue"
import UserTradeQuery from "../views/TradeQuery.vue"
import UserAccountManage from "../views/AccountManage.vue"
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
          name: 'UserHome',
          component: UserHome
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
      path: '/user/:account/manage',
      name: "AccountManage",
      component: UserAccountManage
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
