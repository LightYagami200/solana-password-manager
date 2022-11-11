<template>
  <main class="flex">
    <!-- Sidebar -->
    <aside
      class="w-16 h-screen bg-primary bg-shadow-r flex flex-col items-center pt-6"
    >
      <div
        class="p-4 w-full flex justify-center hover:bg-black hover:bg-opacity-10 transition-colors cursor-pointer"
      >
        <mdicon name="lock-outline" />
      </div>

      <div
        class="p-4 w-full flex justify-center hover:bg-black hover:bg-opacity-10 transition-colors cursor-pointer mb-0 mt-auto"
        @click="logout"
      >
        <mdicon name="power" />
      </div>
    </aside>
    <article class="p-8 w-full">
      <div class="flex justify-between w-full">
        <h2 class="text-4xl text-primary">Passwords</h2>
        <button class="uppercase btn-primary">
          <mdicon name="plus" class="mr-2" /> Add New
        </button>
      </div>
      <div class="mt-12">
        <!-- Display passwords in data table here using tailwindcss, dark theme, striped -->
        <table class="table-auto w-full mt-8">
          <thead class="bg-black bg-opacity-80 rounded-t-lg h-16">
            <tr class="rounded-t-lg">
              <th class="px-4 py-2 text-left rounded-tl-lg">Website</th>
              <th class="px-4 py-2 text-left">Login</th>
              <th class="px-4 py-2 text-left">Password</th>
              <th class="px-4 py-2 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items" :key="`password:${i}`" class="h-12">
              <td
                class="px-4 py-2 bg-black"
                :class="{
                  'bg-opacity-90': i % 2 !== 0,
                  'bg-opacity-50': i % 2 === 0,
                  'rounded-bl-lg': i === items.length - 1,
                }"
              >
                <div class="flex items-center">
                  <img
                    :src="`https://s2.googleusercontent.com/s2/favicons?domain=${item.website}`"
                    :alt="`${item.website} favicon`"
                    class="w-4 h-4 mr-4 rounded-full"
                  />
                  {{ item.website }}
                </div>
              </td>
              <td
                class="px-4 py-2 bg-black"
                :class="{
                  'bg-opacity-90': i % 2 !== 0,
                  'bg-opacity-50': i % 2 === 0,
                }"
              >
                {{ item.login }}
                <button class="ml-2" @click="copyLogin(item.login)">
                  <mdicon name="content-copy" />
                </button>
              </td>
              <td
                class="px-4 py-2 bg-black"
                :class="{
                  'bg-opacity-90': i % 2 !== 0,
                  'bg-opacity-50': i % 2 === 0,
                }"
              >
                ••••••••
                <button class="ml-2" @click="copyPassword(item.password)">
                  <mdicon name="content-copy" />
                </button>
              </td>
              <td
                class="px-4 py-2 bg-black"
                :class="{
                  'bg-opacity-90': i % 2 !== 0,
                  'bg-opacity-50': i % 2 === 0,
                  'rounded-br-lg': i === items.length - 1,
                }"
              >
                <button class="mr-4">
                  <mdicon name="pencil" />
                </button>
                <button class="">
                  <mdicon name="delete" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import { Password } from "@/services/Password";
import { useWallet } from "solana-wallets-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { disconnect } = useWallet();
const router = useRouter();

const items = ref<Password[]>([]);

async function load() {
  // Sleep for 1 second to simulate loading
  await new Promise((resolve) => setTimeout(resolve, 1000));

  items.value = Password.generateMock();

  console.log(items.value);
}

load();

async function copyLogin(login: string) {
  await navigator.clipboard.writeText(login);
}

async function copyPassword(password: string) {
  await navigator.clipboard.writeText(password);
}

async function logout() {
  await disconnect();
  router.push("/login");
}
</script>
