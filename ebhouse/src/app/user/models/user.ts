import { Role } from './role';

export class User {
    name?: string;
    password?: string;
    phone ?: string;
    role ?: Role;
    token?: string;
}