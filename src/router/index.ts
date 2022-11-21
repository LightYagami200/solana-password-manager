import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import { useWallet } from "solana-wallets-vue";
import { usePasswordsStore } from "@/stores/passwords";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
  ],
});

// Validation
router.beforeEach((to) => {
  const { publicKey } = useWallet();
  const { encryptionKey } = usePasswordsStore();

  // -> Make sure publicKey & encryption key is set
  if (to.name === "Home" && (!publicKey.value || !encryptionKey))
    return { name: "Login" };
});

export default router;
