import uniqid from "uniqid";
import * as borsh from "@project-serum/borsh";
import { Config } from "./Config";

export class Password {
  id: string;
  website: string;
  login: string;
  password: string;

  constructor(
    website: string,
    login: string,
    password: string,
    encryptionKey: string,
    id?: string,
    decrypt = false
  ) {
    this.id = id || uniqid.time();
    this.website = decrypt
      ? Config.decrypt(website, encryptionKey)
      : Config.encrypt(website, encryptionKey);
    this.login = decrypt
      ? Config.decrypt(login, encryptionKey)
      : Config.encrypt(login, encryptionKey);
    this.password = decrypt
      ? Config.decrypt(password, encryptionKey)
      : Config.encrypt(password, encryptionKey);
  }

  borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("id"),
    borsh.str("website"),
    borsh.str("login"),
    borsh.str("password"),
  ]);

  static borshAccountSchema = borsh.struct([
    borsh.bool("initialized"),
    borsh.publicKey("owner"),
    borsh.str("id"),
    borsh.str("website"),
    borsh.str("login"),
    borsh.str("password"),
  ]);

  serialize(instruction: number) {
    const buffer = Buffer.alloc(1000);

    this.borshInstructionSchema.encode(
      {
        ...this,
        variant: instruction,
      },
      buffer
    );

    return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer));
  }

  static deserialize(buffer: Buffer, encryptionKey?: string) {
    if (!buffer || !encryptionKey) return null;

    try {
      const { id, website, login, password } =
        this.borshAccountSchema.decode(buffer);

      return new Password(website, login, password, encryptionKey, id, true);
    } catch (error) {
      console.error({ DESERIALIZE_ERROR: error });
      return null;
    }
  }
}
