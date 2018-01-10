
export class Group{

  private name: string;
  private description: string;
  private isGroup:boolean;
  private links: any;

  constructor(name: string, description: string, isGroup:boolean, links: any){
    this.name = name;
    this.description = description;
    this.isGroup = isGroup;
    this.links = links;
  }

  getName():string{
    return this.name;
  }

  getDescription():string{
    return this.description;
  }

  getIsGroup():boolean{
    return this.isGroup;
  }

  getLinks():any{
    return this.links;
  }


  setName(aName: string){
    this.name = aName;
  }

  setDescription(aDescription: string){
    this.description = aDescription;
  }

  setIsGroup(anIsGroup:boolean){
    this.isGroup = anIsGroup;
  }

  setLinks(aLinks: any){
    this.links = aLinks;
  }
}

