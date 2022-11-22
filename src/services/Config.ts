import * as borsh from "@project-serum/borsh";
import Crypto from "crypto-js";

export class Config {
  hash: string;

  constructor(hash: string) {
    this.hash = hash;
  }

  borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("hash"),
  ]);

  static borshAccountSchema = borsh.struct([
    borsh.bool("initialized"),
    borsh.str("hash"),
  ]);

  serialize() {
    const buffer = Buffer.alloc(1000);

    this.borshInstructionSchema.encode(
      {
        ...this,
        variant: 0,
      },
      buffer
    );

    return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer));
  }

  static deserialize(buffer?: Buffer) {
    if (!buffer) return null;

    try {
      const { hash } = this.borshAccountSchema.decode(buffer);

      return new Config(hash);
    } catch (error) {
      console.error({ DESERIALIZE_ERROR: error });
      return null;
    }
  }

  static encrypt(text: string, encryptionKey: string) {
    return Crypto.AES.encrypt(text, encryptionKey).toString();
  }

  static decrypt(text: string, encryptionKey: string) {
    return Crypto.AES.decrypt(text, encryptionKey).toString(Crypto.enc.Utf8);
  }
}
