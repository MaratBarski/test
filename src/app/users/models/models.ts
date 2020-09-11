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
    Open:  'open',
    Initial: 'initial',
    Close: 'close'
}