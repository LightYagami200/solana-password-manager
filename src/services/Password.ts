export class Password {
  website: string;
  login: string;
  password: string;

  constructor(website: string, login: string, password: string) {
    this.website = website;
    this.login = login;
    this.password = password;
  }

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
}
