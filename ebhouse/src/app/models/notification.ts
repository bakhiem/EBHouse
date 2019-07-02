import {User }from '../user/models/user';

export class Notification {
  subject?:string;
  content?:string;
  userForm?:User;
  userTo?:User;
  id?:string;
  status:number;
  cDate?:any;
  mDate?:any;
  dDate?:any;
}
