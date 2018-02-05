
export class Role{

  private name: string;
  private description: string;
  private supportsNesting:boolean;
  private links: any;

  constructor(name: string, description: string, supportsNesting:boolean, links: any){
    this.name = name;
    this.description = description;
    this.supportsNesting = supportsNesting;
    this.links = links;
  }

  getName():string{
    return this.name;
  }

  getDescription():string{
    return this.description;
  }

  getSupportsNesting():boolean{
    return this.supportsNesting;
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

  setSupportsNesting(supportsNesting:boolean){
    this.supportsNesting = supportsNesting;
  }

  setLinks(aLinks: any){
    this.links = aLinks;
  }
}

