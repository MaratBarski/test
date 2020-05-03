export const environment = {
  name: 'kostyan',
  production: false,
  serverUrl: 'http://10.0.2.18:4000/',
  //loginUrl: 'http://localhost:3000/login/',
  loginUrl: 'http://10.0.2.18:4000/login',
  socketUrl: 'http://localhost:4444',
  isOfflineMode: false,
  endPoints: {
    userData: 'user-data',
    fileSource: 'kostya/api/v1/file-source',
    templateByProject: 'kostya/api/v1/template/get-by-project',
    uploadFileSource: 'kostya/api/v1/upload/file-source',
    deleteFileSource: 'kostya/api/v1/file-source',
    getRelationalIntegrity: 'kostya/api/v1/get-relational-integrity',
    uploadHierarchy: 'kostya/api/v1/upload/hierarchy',
    updateHierarchy: 'kostya/api/v1/updateHierarchy',
    downloadCategory: 'kostya/api/v1/hierarchy/download',
    deleteCategory: 'kostya/api/v1/hierarchy',
    hierarchy: 'kostya/api/v1/hierarchy',
    historyReport: 'kostya/api/v1/session-history',
    downloadHistoryReport: 'moshe/api/v1/session-history/download',
    usageReport: 'kostya/api/v1/reporting/usage',
  }
};
