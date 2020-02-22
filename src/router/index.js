import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Planning from '@/components/Planning.vue'
import Summary from '@/components/Summary.vue'
import Setting from '@/components/Setting.vue'
import Expenditure from '@/components/Expenditure.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import RegistrationComplete from '@/components/RegistrationComplete.vue'
import EmailVerified from '@/components/EmailVerified.vue'

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    { path: '/',            name: "home",        component: Home,        meta: { guest: true } },
    { path: "/login",       name: "login",       component: Login,       meta: { guest: true } },
    { path: "/register",    name: "register",    component: Register,    meta: { guest: true } },
    { path: "/planning",    name: "planning",    component: Planning,    meta: { requiresAuth: true } },
    { path: "/summary",     name: "summary",     component: Summary,     meta: { requiresAuth: true } },
    { path: "/setting",     name: "setting",     component: Setting,     meta: { requiresAuth: true } },
    { path: "/expenditure", name: "expenditure", component: Expenditure, meta: { requiresAuth: true } },
    { path: "/email-verified",         name: "email-verified",         component: EmailVerified,        meta: { guest: true } },
    { path: "/reset-password",         name: "reset-password",         component: ResetPassword,        meta: { guest: true } },
    { path: "/forgot-password",        name: "forgot-password",        component: ForgotPassword,       meta: { guest: true } },
    { path: "/registeration-complete", name: "registeration-complete", component: RegistrationComplete, meta: { guest: true } },
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
            next({ name: 'planning'})
        }
    } else {
        next() 
    }
})

export default router
