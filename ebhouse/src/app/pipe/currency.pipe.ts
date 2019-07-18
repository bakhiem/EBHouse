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
@Pipe({name: 'currency'})
export class CurrencyFormat implements PipeTransform {
  transform(value: number, type ?: number): string {
        if(value === 0 &&  type == 2){
            return "0";  
        }
        else if (value === 0  &&  type != 2){
          return "";  
      }
        let currency = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        return currency;
        
}
}