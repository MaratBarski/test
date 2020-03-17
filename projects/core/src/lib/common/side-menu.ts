export interface MenuItem {
    url?: string;
    text: string;
    id?: string;
    subLinks?: Array<MenuItem>;
    showSubMenu?: boolean;
    active?: boolean;
}

export const PageInfo = {
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
    PatientStorySettings: {
        id: 'PatientStorySettings'
    }
}

export const SideMenu: Array<MenuItem> = [
    {
        id: PageInfo.ManageUsers.id,
        url: '',
        text: 'Manage Users',
        subLinks: [
            {
                url: '',
                text: 'Text1'
            },
            {
                url: '',
                text: 'Text1'
            },
        ]
    },
    {
        id: PageInfo.ProjectSiteSettings.id,
        url: '',
        text: 'Project & Site Settings'
    },
    {
        id: PageInfo.MonitorReports.id,
        url: '',
        text: 'Monitor & Reports'
    },
    {
        id: PageInfo.ManageHierarchies.id,
        url: 'categorization',
        text: 'Manage Hierarchies'
    },
    {
        id: PageInfo.QueriesEvents.id,
        url: '',
        text: 'Queries & Events'
    },
    {
        id: PageInfo.ImportedFiles.id,
        url: 'imported-files',
        text: 'Imported Files'
    },
    {
        url: '',
        text: 'Jobs Scheduling'
    },
    {
        id: PageInfo.PatientStorySettings.id,
        url: '',
        text: 'Patient Story Settings'
    },
    {
        id: PageInfo.ExternalApplications.id,
        url: '',
        text: 'External Applications'
    }
]
