import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaxLength }from '../pipe/max-leng.pipe';

import {CurrencyFormat }from '../pipe/currency.pipe';
@NgModule({
  declarations: [
    MaxLength,
    CurrencyFormat],
  imports: [
    CommonModule
  ],
  exports :[
    MaxLength,
    CurrencyFormat
  ]
})
export class SharedModule { }
