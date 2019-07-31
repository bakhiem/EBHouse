import { Role } from '../user/models/role';
import { User } from '../user/models/user';
export class Admin {
    role ?: Role;
    id?:string;
    user?:User;
}
