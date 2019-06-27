import { NativeDateAdapter } from '@angular/material';
import * as _moment from 'moment';
import 'moment-timezone';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { Router } from '@angular/router';


const moment = _rollupMoment || _moment;
export class CustomDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
      var formatString = 'DD /MM /YYYY';
      return moment(date).format(formatString);
    }
  }