import { createStore } from "vuex"

export default createStore({
	state: {
		// Define your state here
		user: null,
	},
	getters: {
		// Define your getters here
		username: (state) => state.user?.username || "",
		roles: (state) => state.user?.roles || [],
		status: (state) => state.user?.status || "",
	},
	mutations: {
		// Define your mutations here
		setUser(state, user) {
			state.user = user;
		},
		clearUser(state) {
			state.user = null;
		},
	},
	actions: {
		// Define your actions here
		async login({ commit }, username) {
			try {
				console.log("username " + username);
				const res = await fetch(`/api/users/login/${username}`, {
					method: "POST",
				});
				console.log(res.status, res.ok);
				if (!res.ok) throw new Error("Login failed");

				const user = await res.json();
				commit("setUser", user);
			} catch (err) {
				commit("clearUser");
				throw err;
			}
		},
		logout({ commit }) {
			commit("clearUser");
		},
	},
	modules: {
		// Define your modules here
	},
})
