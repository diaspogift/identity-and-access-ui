
import {Injectable} from "@angular/core";

@Injectable()

export class TenantService{

  //public tenantId : string;
  public tenant:string;

  getTenantId(name:String):string{
   let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex: RegExp = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results:RegExpExecArray = regex.exec(url);

    //console.log("Log: " + url);
    if (results == null){
      console.log("Log: url est null");
      return null;
    }
    else if(results.length == 0){
      return null;
    }
    else if (results.length >= 3 && !results[2]){
      return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}

//export  let TENANT_ID : String="";
