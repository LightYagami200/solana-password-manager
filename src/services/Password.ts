import uniqid from "uniqid";
import * as borsh from "@project-serum/borsh";

export class Password {
  id: string;
  website: string;
  login: string;
  password: string;

  constructor(website: string, login: string, password: string, id?: string) {
    this.id = id || uniqid.time();
    this.website = website;
    this.login = login;
    this.password = password;
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
    borsh.str("id"),
    borsh.str("website"),
    borsh.str("login"),
    borsh.str("password"),
  ]);

  static generateMock(): Password[] {
    return [
      new Password("google.com", "user@gmail.com", "somepas$word123"),
      new Password("github.com", "user@mail.com", "lorem#ipsum"),
      new Password("facebook.com", "user@mail.com", "dolor$amet"),
      new Password("twitter.com", "SomeUser", "consectetur@adipiscing"),
      new Password("instagram.com", "user@anothermail.com", "elit#sed"),
      new Password("linkedin.com", "user@anothermail.com", "do$eiusmod"),
    ];
  }

  serialize(instruction: number) {
    const buffer = Buffer.alloc(1000);

    console.log({
      variant: instruction,
      ...this,
    });

    this.borshInstructionSchema.encode(
      {
        ...this,
        variant: instruction,
      },
      buffer
    );

    console.log({ buffer });

    return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer));
  }

  static deserialize(buffer?: Buffer) {
    if (!buffer) return null;

    try {
      const { id, website, login, password } =
        this.borshAccountSchema.decode(buffer);

      return new Password(website, login, password, id);
    } catch (error) {
      console.error({ DESERIALIZE_ERROR: error });
      return null;
    }
  }
}
