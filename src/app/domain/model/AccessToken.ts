
export class AccessToken{
  public accessToken:string;
  public tokenType:string;
  public refreshToken: string;
  public expiresIn: number;
  public scope:string;
  public receivedAt: number;
  public username: string;


  constructor(accessToken: string, tokenType: string, refreshToken: string, expiresIn: number, scope: string, receivedAt: number, username: string) {
    this.accessToken = accessToken;
    this.tokenType = tokenType;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
    this.scope = scope;
    this.receivedAt = receivedAt;
    this.username = username;
  }


  isValide():boolean{
    return (new Date().getTime()) < this.receivedAt;
  }


}
