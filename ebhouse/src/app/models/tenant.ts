import { Role } from '../user/models/role';
import { User } from '../user/models/user';
export class Tenant {
    role ?: Role;
    id?:string;
    user?:User;
    imgArnFront?:string;
    imgArnBack?:string;
}