import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'maxLength'})
export class MaxLength implements PipeTransform {
  transform(value: string, stringLength: number): string {
        if(value.length == 0){
            return "";  
        }
        let res = value.split(" ");
        if(res.length > stringLength){
            let reStr : string = "";
            for(let i = 0; i <= stringLength; i ++){
                reStr += res[i] + ' ';
            }
            reStr =  reStr + '...';
            return reStr;
        }
        else{
            return value;
        }
        
}
}