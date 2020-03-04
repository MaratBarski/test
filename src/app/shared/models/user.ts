import { Project } from 'src/app/imported-files/models/project';
import { FileSource } from 'src/app/imported-files/models/file-source';
import { Authority } from './authority';

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
    fileSources: Array<FileSource>;
    projects: Array<Project>

}