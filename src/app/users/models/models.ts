import { SelectOption } from '@app/core-api';

export const NO_ALLOWED_EVENTS = 1;
export const ALL_EVENTS = 2;
export const BASED_EVENTS = 3;

export const AllowedEvents = [
    { id: NO_ALLOWED_EVENTS, text: 'No allowed events (Default)' },
    { id: ALL_EVENTS, text: 'All events' },
    { id: BASED_EVENTS, text: 'Events based on permission templates:' }
]

export class PermissionSet {
    isNew: boolean;
    isActive: boolean;
    setName: string;
    setFullName: string;
    setDescription: string;
    size?: number;
    fromDateUnlimited?: boolean;
    toDateUnlimited?: boolean;
    fromDate?: Date;
    toDate?: Date;
    keyExpirationDate?: Date;
    keyName: string;
    project: any;
    projectName?: string;
    fromSetId?: any;
    fromSetName?: string;
    userId?: any;
    allowedEvent: number;
    researchTemplates: Array<any>;
    researchRestrictionEvents: Array<any>;
    roleItems: Array<any>;
    data: {
        researchStatus?: string;
    }
}

export const ResearchStatus = {
    Open: 'Open',
    Initial: 'Initial',
    Close: 'Closed'
}

export const RoleOptions: Array<SelectOption> = [
    { id: 1, text: 'End user', value: 'End User' },
    { id: 2, text: 'Admin', value: 'Admin' }
];

export const DataOptions: Array<SelectOption> = [
    { id: 1, text: 'Syntatic', value: '1' },
    { id: 2, text: 'Original', value: '2' }
];

export const CoefficientOptions: Array<SelectOption> = [
    { id: 4, text: '4 (Default)', value: '4' },
    { id: 5, text: '5', value: '5' },
    { id: 6, text: '6', value: '6' },
    { id: 7, text: '7', value: '7' },
    { id: 8, text: '8', value: '8' },
    { id: 9, text: '9', value: '9' },
    { id: 10, text: '10', value: '10' }
];