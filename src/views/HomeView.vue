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
        <button class="uppercase btn-primary" @click="addPassword.show = true">
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
            <tr
              v-for="(item, i) in store.passwords"
              :key="`password:${i}`"
              class="h-12"
            >
              <td
                class="px-4 py-2 bg-black"
                :class="{
                  'bg-opacity-90': i % 2 !== 0,
                  'bg-opacity-50': i % 2 === 0,
                  'rounded-bl-lg': i === store.passwords.length - 1,
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
                  'rounded-br-lg': i === store.passwords.length - 1,
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

  <!-- Add new Password -->
  <modal
    v-model="addPassword.show"
    @confirm="confirmAddPassword"
    @cancel="closeAddPassword"
  >
    <template v-slot:title>Add New Password</template>
    <!-- 3 inputs for each of the add password fields, dark mode, tailwindcss, minimalistic -->
    <div class="flex flex-col">
      <label class="mt-4">Website</label>
      <input
        type="text"
        class="input-primary"
        v-model="addPassword.website"
        placeholder="Website"
      />

      <label class="mt-4">Login</label>
      <input
        type="text"
        class="input-primary"
        v-model="addPassword.login"
        placeholder="Login"
      />

      <label class="mt-4">Password</label>
      <input
        type="text"
        class="input-primary"
        v-model="addPassword.password"
        placeholder="Password"
      />
    </div>
  </modal>
</template>

<script setup lang="ts">
import { Password } from "@/services/Password";
import { useWallet } from "solana-wallets-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Modal from "@/components/SimpleModal.vue";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { usePasswordsStore } from "@/stores/passwords";

const programId = new PublicKey("5b6mXCbxaknKnmpSjj8ioKX1HdgF6q6VmhSkvNzBJQEW");
const connection = new Connection("http://localhost:8899", "confirmed");

const { disconnect, publicKey, sendTransaction } = useWallet();
const router = useRouter();
const store = usePasswordsStore();

const addPassword = ref({
  show: false,
  website: "",
  login: "",
  password: "",
});

async function load() {
  store.fetchPasswords();
}

load();

async function copyLogin(login: string) {
  await navigator.clipboard.writeText(login);
}

async function copyPassword(password: string) {
  await navigator.clipboard.writeText(password);
}

async function closeAddPassword() {
  addPassword.value.show = false;
  addPassword.value.website = "";
  addPassword.value.login = "";
  addPassword.value.password = "";
}

async function confirmAddPassword() {
  console.log("confirm");

  if (
    !addPassword.value.website ||
    !addPassword.value.login ||
    !addPassword.value.password ||
    !publicKey.value
  ) {
    // TODO: Add toasts
    return;
  }

  const password = new Password(
    addPassword.value.website,
    addPassword.value.login,
    addPassword.value.password
  );

  const buffer = password.serialize(0);

  const [pda] = await PublicKey.findProgramAddress(
    // eslint-disable-next-line no-undef
    [publicKey.value.toBuffer(), Buffer.from(password.id)],
    programId
  );

  const tx = new Transaction().add(
    new TransactionInstruction({
      programId,
      keys: [
        {
          pubkey: publicKey.value,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
    })
  );

  try {
    const sig = await sendTransaction(tx, connection);

    console.log(
      `Explorer: https://explorer.solana.com/tx/${sig}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
    );
  } catch (e) {
    console.log({ TX_ERROR: e });
  }

  closeAddPassword();
}

async function logout() {
  await disconnect();
  router.push("/login");
}
</script>
