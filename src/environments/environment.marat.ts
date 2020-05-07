export const environment = {
    name: 'marat',
    production: false,
    serverUrl: 'http://10.0.2.18:4000/',
    //loginUrl: 'http://localhost:3000/login/',
    loginUrl: 'http://10.0.2.18:3000/login',
    socketUrl: 'http://localhost:4444',
    isOfflineMode: true,
    endPoints: {
        userData: 'user-data',
        fileSource: 'mdclone/api/v1/file-source',
        uploadFileSource: 'mdclone/api/v1/upload/file-source',
        getSampleData: 'kostya/api/v1/file-source/get-sample-data',
        getRelationalIntegrity: 'mdclone/api/v1/get-relational-integrity',
        uploadHierarchy: 'mdclone/api/v1/upload/hierarchy',
        deleteFileSource: 'mdclone/api/v1/file-source',
        deleteCategory: 'mdclone/api/v1/hierarchy',
        downloadCategory: 'mdclone/api/v1/hierarchy/download',
        hierarchy: 'mdclone/api/v1/hierarchy',
        historyReport: 'mdclone/api/v1/session-history',
        downloadHistoryReport: 'moshe/api/v1/session-history/download',
        usageReport: 'mdclone/api/v1/reporting/usage',
        templateByProject: 'mdclone/api/v1/template/get-by-project',
        updateHierarchy: 'mdclone/api/v1/updateHierarchy',
        config: 'config'
    }
};
