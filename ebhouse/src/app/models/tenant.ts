import { Role } from '../user/models/role';

export class Tenant {
    name?: string;
    password?: string;
    phone ?: string;
    role ?: Role;
    token?: string;
    address?: string;
    sex?:string;
    id?:string;
    status?:string;
}