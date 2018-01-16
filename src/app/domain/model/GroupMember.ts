
export class GroupMember{

  private name: string;
  private type: string;
  private links: any;

  constructor(name: string, type: string, links: any){
    this.name  = name;
    this.type = type;
    this.links = links;
  }

  getName():string{
    return this.name;
  }

  getType():string{
    return this.type;
  }

  getLinks():any{
    return this.links;
  }

  setName(name: string):void{
    this.name = name;
  }

  setTyp(type: string):void{
    this.type = type;
  }

  setLinks(links: any):void{
    this.links = links;
  }
}
