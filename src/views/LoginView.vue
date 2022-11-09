<template>
  <main>
    <header>
      <div class="flex justify-between h-screen">
        <div class="w-1/3 p-8 flex flex-col justify-center">
          <h1 class="text-8xl font-bold">
            Sol Vault<span class="blink-animation">|</span>
          </h1>
          <h3 class="text-xl">Password Manager based on Solana Blockchain</h3>
        </div>
        <div
          class="w-1/3 bg-primary bg-shadow-l flex flex-col justify-center items-center"
        >
          <h5 class="mb-4">Login with your wallet</h5>
          <wallet-multi-button dark></wallet-multi-button>
        </div>
      </div>
    </header>
  </main>
</template>

<script setup lang="ts">
import { WalletMultiButton } from "solana-wallets-vue";
</script>
