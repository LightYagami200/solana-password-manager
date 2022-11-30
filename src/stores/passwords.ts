import { Config } from "@/services/Config";
import { Password } from "@/services/Password";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { defineStore } from "pinia";
import { useWallet } from "solana-wallets-vue";

const programId = new PublicKey("JAHurE5i7rjDizB8eJaVuRvQLPL8xZ7ctNghvMrPCzcT");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const usePasswordsStore = defineStore("passwords", {
  state: () => ({
    hash: "",
    passwords: [] as Password[],
    encryptionKey: "",
  }),
  actions: {
    async fetchPasswords() {
      const { publicKey } = useWallet();

      // -> Fetch passwords from solana
      const accounts = await connection.getProgramAccounts(programId, {
        filters: [
          {
            memcmp: {
              offset: 1,
              bytes: publicKey.value!.toBase58(),
            },
          },
        ],
      });

      this.passwords = accounts
        .map(({ account }) =>
          Password.deserialize(account.data, this.encryptionKey)
        )
        .filter((password) => password)
        .map((password) => password as Password);
    },
    async fetchConfig() {
      const { publicKey } = useWallet();

      // -> Fetch encryption hash from solana
      const [pda] = await PublicKey.findProgramAddress(
        [publicKey.value!.toBuffer(), Buffer.from("config")],
        programId
      );

      const account = await connection.getAccountInfo(pda);

      const config = Config.deserialize(account?.data);

      this.hash = config?.hash || "";
    },
    async setEncryptionKey(encryptionKey: string) {
      this.encryptionKey = encryptionKey;
    },
  },
});
