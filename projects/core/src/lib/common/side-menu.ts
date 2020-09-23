export interface MenuItem {
    url?: string;
    text: string;
    id?: string;
    subLinks?: Array<MenuItem>;
    showSubMenu?: boolean;
    active?: boolean;
    order?: number;
}

export const PageInfo = {
    Patient: {
        id: 'Patient'
    },
    ManageUsers: {
        id: 'ManageUsers'
    },
    ProjectSiteSettings: {
        id: 'ProjectSiteSettings'
    },
    ExternalApplications: {
        id: 'ExternalApplications'
    },
    ManageHierarchies: {
        id: 'ManageHierarchies'
    },
    MonitorReports: {
        id: 'MonitorReports'
    },
    QueriesEvents: {
        id: 'QueriesEvents'
    },
    ImportedFiles: {
        id: 'ImportedFiles'
    },
    JobsScheduling: {
        id: 'JobsScheduling'
    },
    PatientStorySettings: {
        id: 'PatientStorySettings'
    },
    Researchers: {
        id: 'Researchers'
    }
}

export const ResearcherEnableMenu = {
    [PageInfo.ManageUsers.id]: false,
    [PageInfo.MonitorReports.id]: true,
    [PageInfo.ManageHierarchies.id]: true,
    [PageInfo.ImportedFiles.id]: true,
    [PageInfo.JobsScheduling.id]: true,
    [PageInfo.Researchers.id]: false,
    [PageInfo.Patient.id]: true
}

export const SideMenu: Array<MenuItem> = [
    {
        id: PageInfo.ManageUsers.id,
        url: 'users',
        text: 'Manage Users',
    },
    // {
    //     id: PageInfo.ManageUsers.id,
    //     url: '',
    //     text: 'Manage Users',
    //     subLinks: [
    //         {
    //             url: '',
    //             text: 'Text'
    //         },
    //         {
    //             url: '',
    //             text: 'Text1'
    //         },
    //     ]
    // },
    {
        id: PageInfo.MonitorReports.id,
        url: 'history-report',
        text: 'Output History Report'
    },
    {
        id: PageInfo.ManageHierarchies.id,
        url: 'categorization',
        text: 'Manage Hierarchies'
    },
    {
        id: PageInfo.ImportedFiles.id,
        url: 'imported-files',
        text: 'Imported Files'
    },
    {
        id: PageInfo.JobsScheduling.id,
        url: 'usage-dashboard',
        text: 'Usage Report'
    },
    {
        id: PageInfo.Researchers.id,
        url: 'users/research',
        text: 'Permission Sets'
    }
    , {
        id: PageInfo.Patient.id,
        url: 'patient',
        text: 'Patient Story'
    }
]
