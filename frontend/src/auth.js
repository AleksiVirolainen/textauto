import { reactive } from "vue";

const TOKEN_KEY = "messenger_token";
const USER_KEY = "messenger_user";

const state = reactive({
  token: localStorage.getItem(TOKEN_KEY) || "",
  user: safeParse(localStorage.getItem(USER_KEY))
});

function safeParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export const auth = {
  state,
  isLoggedIn() {
    return Boolean(state.token);
  },
  getToken() {
    return state.token;
  },
  setSession(token, user) {
    state.token = token;
    state.user = user;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user || null));
  },
  clear() {
    state.token = "";
    state.user = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
