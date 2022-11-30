import { createApp } from "vue";
import { createPinia } from "pinia";
import SolanaWallets from "solana-wallets-vue";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import Toast from "vue-toastification";
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import mdiVue from "mdi-vue/v3";
import * as mdijs from "@mdi/js";
import { vfmPlugin } from "vue-final-modal";

import "solana-wallets-vue/styles.css";
import "vue-toastification/dist/index.css";

import App from "./App.vue";
import router from "./router";

import "./assets/styles.css";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
};

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(SolanaWallets, walletOptions);
app.use(mdiVue, {
  icons: mdijs,
});
app.use(vfmPlugin);
app.use(Toast);

app.mount("#app");
