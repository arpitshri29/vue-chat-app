import { createWebHistory, createRouter } from 'vue-router';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Profile from '../components/Profile';

const routes = [
    {
        path: "/",
        name: "Login",
        component: Login,
    },
    {
        path: "/signup",
        name: "Signup",
        component: Signup,
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;