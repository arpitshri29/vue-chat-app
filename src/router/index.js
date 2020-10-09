import { createWebHistory, createRouter } from 'vue-router';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Profile from '../components/Profile';
import Chat from "../components/Chat";

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
    },
    {
        path: "/chat",
        name: "Chat",
        component: Chat,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;