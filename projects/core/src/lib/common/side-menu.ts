export interface MenuItem {
    url: string;
    text: string;
    subLinks?: Array<MenuItem>;
}
export const SideMenu: Array<MenuItem> = [
    {
        url: '#',
        text: 'Manage Users',
        subLinks: [
            {
                url: '#',
                text: 'Text1'
            },
            {
                url: '#',
                text: 'Text1'
            },            
        ]
    },
    {
        url:'#',
        text:'Project & Site Settings'
    },
    {
        url:'#',
        text:'Monitor & Reports'
    },
    {
        url:'categorization',
        text:'Manage Hierarchies'
    },
    {
        url:'#',
        text:'Queries & Events'
    },
    {
        url:'imported-files',
        text:'Imported Files'
    },
    {
        url:'#',
        text:'Jobs Scheduling'
    },
    {
        url:'#',
        text:'Patient Story Settings'
    },
    {
        url:'#',
        text:'External Applications'
    },
    {
        url:'#',
        text:''
    },
    {
        url:'#',
        text:''
    },

]
