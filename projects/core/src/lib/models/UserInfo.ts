import { Project } from './Project';

export class UserInfo {
    token: string;
    user: User;
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
    activationKey?: any;
    resetKey?: any;
    createdBy: string;
    createdDate?: Date;
    resetDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    cellPhone?: string;
    domain?: string;
    photo?: any;
    projects: Array<Project>;
}