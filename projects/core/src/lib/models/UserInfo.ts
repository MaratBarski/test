import { Project } from './Project';
import { Authority } from './Authority';

export class UserInfo {
    token: string;
    user: User;
}

export class UserResponse {
    status: boolean;
    data: User;
}

export class User {
    id: number;
    login: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    email: string;
    activated: boolean;
    langKey: string;
    activationKey: string;
    resetKey: string;
    createdBy: string;
    createdDate: Date;
    resetDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    cellPhone: string;
    domain: string;
    photo: string;
    authorities: Array<Authority>;
    projects: Array<Project>;
}
