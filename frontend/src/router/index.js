import { createRouter, createWebHistory } from "vue-router"
import store from "../store";
import Login from "../views/Login.vue"

const routes = [
	{
		path: "/",
		name: "Login",
		component: Login,
	},
	{
		path: "/home",
		name: "Home",
		// Lazy loading for better performance
		component: () => import("../views/Home.vue"),
	},
	{
		path: "/admin",
		name: "Admin",
		component: () => import("../views/AdminView.vue"),
		meta: { roles: ["Admin"] }
	},
	{
		path: "/editor",
		name: "Editor",
		component: () => import("../views/EditorView.vue"),
		meta: { roles: ["Editor", "Admin"] }
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	const user = store.state.user;
	console.log("store.state.user: " + store.state.user);
	console.log("store:", store);

	if (!user) {
		if (to.path !== "/") return next("/");
		return next();
	}
	if (user.status === "Deleted") {
		store.dispatch("logout");
		return next("/");
	}
	if (to.meta.roles && !to.meta.roles.some((role) => user.roles.includes(role))) {
		return next("/home");
	}
	next();
});

export default router
