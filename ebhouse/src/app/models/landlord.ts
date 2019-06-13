import { Role } from '../user/models/role';

export class Landlord {
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