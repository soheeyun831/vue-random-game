import {createWebHistory, createRouter} from 'vue-router';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Layout from '@/views/Layout';
import Home from '@/views/home';
import Stepladder from '@/views/stepladder/Ladder.vue';
import Roulette from '@/views/roulette/Roulette.vue';
import Card from '@/views/card/Card.vue';
const routes = [
    {
        path: '/',
        name: 'Main',
        component: Layout,
        children: [
            {
                path: '',
                name: 'Home',
                component: Home,
                meta: {
                    screenName: 'Stepladder',
                },
            },
            {
                path: '/ladder',
                name: 'Stepladder',
                component: Stepladder,
                meta: {
                    screenName: 'Stepladder',
                },
            },
            {
                path: '/roulette',
                name: 'Roulette',
                component: Roulette,
                meta: {
                    screenName: 'Roulette',
                },
            },
            {
                path: '/card',
                name: 'Card',
                component: Card,
                meta: {
                    screenName: 'Card',
                },
            }
            ]
    }
];


NProgress.configure({ showSpinner: false });
const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
});

router.afterEach(() => {
    NProgress.done();
});


export default router;