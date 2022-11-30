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
          <tbody v-if="store.passwords.length">
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
                <button class="mr-4" @click="openEditPassword(item)">
                  <mdicon name="pencil" />
                </button>
                <!-- <button>
                  <mdicon name="delete" />
                </button> -->
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td class="px-4 py-2 bg-black bg-opacity-50 rounded-bl-lg">
                No passwords found
              </td>
              <td class="px-4 py-2 bg-black bg-opacity-50"></td>
              <td class="px-4 py-2 bg-black bg-opacity-50"></td>
              <td class="px-4 py-2 bg-black bg-opacity-50 rounded-br-lg"></td>
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
    :loading="addPassword.loading"
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

  <!-- Edit Password -->
  <modal
    v-model="editPassword.show"
    @confirm="confirmEditPassword"
    @cancel="closeEditPassword"
  >
    <template v-slot:title>Add New Password</template>
    <!-- 3 inputs for each of the add password fields, dark mode, tailwindcss, minimalistic -->
    <div class="flex flex-col">
      <label class="mt-4">Website</label>
      <input
        type="text"
        class="input-primary"
        v-model="editPassword.website"
        placeholder="Website"
      />

      <label class="mt-4">Login</label>
      <input
        type="text"
        class="input-primary"
        v-model="editPassword.login"
        placeholder="Login"
      />

      <label class="mt-4">Password</label>
      <input
        type="text"
        class="input-primary"
        v-model="editPassword.password"
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
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { usePasswordsStore } from "@/stores/passwords";
import { useToast } from "vue-toastification";

const programId = new PublicKey("JAHurE5i7rjDizB8eJaVuRvQLPL8xZ7ctNghvMrPCzcT");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const { disconnect, publicKey, sendTransaction } = useWallet();
const router = useRouter();
const store = usePasswordsStore();
const toast = useToast();

const addPassword = ref({
  show: false,
  website: "",
  login: "",
  password: "",
  loading: false,
});

const editPassword = ref({
  show: false,
  website: "",
  login: "",
  password: "",
  id: "",
  loading: false,
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

async function openEditPassword(password: Password) {
  editPassword.value.show = true;
  editPassword.value.website = password.website;
  editPassword.value.login = password.login;
  editPassword.value.password = password.password;
  editPassword.value.id = password.id;
}

async function closeAddPassword() {
  addPassword.value.show = false;
  addPassword.value.website = "";
  addPassword.value.login = "";
  addPassword.value.password = "";
}

async function closeEditPassword() {
  editPassword.value.show = false;
  editPassword.value.website = "";
  editPassword.value.login = "";
  editPassword.value.password = "";
  editPassword.value.id = "";
}

async function confirmAddPassword() {
  if (
    !addPassword.value.website ||
    !addPassword.value.login ||
    !addPassword.value.password ||
    !publicKey.value
  ) {
    toast.error("Please fill all fields");
    return;
  }

  addPassword.value.loading = true;

  const password = new Password(
    addPassword.value.website,
    addPassword.value.login,
    addPassword.value.password,
    store.encryptionKey
  );

  const buffer = password.serialize(1);

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
    const latestBlockHash = await connection.getLatestBlockhash();

    console.log(
      `Explorer: https://explorer.solana.com/tx/${sig}?cluster=devnet`
    );

    // Wait for confirmation
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: sig,
    });

    await store.fetchPasswords();
  } catch (e) {
    console.log({ TX_ERROR: e });
    toast.error("Error adding password");
  }

  addPassword.value.loading = false;

  toast.success("Password added");

  closeAddPassword();
}

async function confirmEditPassword() {
  if (
    !editPassword.value.website ||
    !editPassword.value.login ||
    !editPassword.value.password ||
    !publicKey.value
  ) {
    toast.error("Please fill all fields");
    return;
  }

  editPassword.value.loading = true;

  const password = new Password(
    editPassword.value.website,
    editPassword.value.login,
    editPassword.value.password,
    store.encryptionKey,
    editPassword.value.id
  );

  const buffer = password.serialize(2);

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
    const latestBlockHash = await connection.getLatestBlockhash();

    console.log(
      `Explorer: https://explorer.solana.com/tx/${sig}?cluster=devnet`
    );

    // Wait for confirmation
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: sig,
    });

    await store.fetchPasswords();
  } catch (e) {
    console.log({ TX_ERROR: e });
    toast.error("Error updating password");
  }

  editPassword.value.loading = false;

  toast.success("Password updated");

  closeEditPassword();
}

async function logout() {
  await disconnect();
  router.push("/login");
}
</script>
