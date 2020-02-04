import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Dashboard from '@/components/Dashboard.vue'
import Summary from '@/components/Summary.vue'
import Setting from '@/components/Setting.vue'
import Expenditure from '@/components/Expenditure.vue'
import RegistrationComplete from '@/components/RegistrationComplete.vue'

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    { path: '/',            name: "home",        component: Home },
    { path: "/login",       name: "login",       component: Login,       meta: { guest: true } },
    { path: "/register",    name: "register",    component: Register,    meta: { guest: true } },
    { path: "/dashboard",   name: "dashboard",   component: Dashboard,   meta: { requiresAuth: true } },
    { path: "/summary",     name: "summary",     component: Summary,     meta: { requiresAuth: true } },
    { path: "/setting",     name: "setting",     component: Setting,     meta: { requiresAuth: true } },
    { path: "/expenditure", name: "expenditure", component: Expenditure, meta: { requiresAuth: true } },
    { path: "/registeration-complete",   name: "registeration-complete",   component: RegistrationComplete, meta: { guest: true } },
  ]
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('jwt') == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            next()
        }
    } else if(to.matched.some(record => record.meta.guest)) {
        if(localStorage.getItem('jwt') == null) {
            next()
        }
        else {
            next({ name: 'home'})
        }
    } else {
        next() 
    }
})

export default router
