export const environment = {
  name: 'dev',
  production: false,
  serverUrl: 'http://10.0.2.18:4000/',
  //loginUrl: 'http://localhost:3000/login/',
  loginUrl: 'http://10.0.2.18:3000/login',
  socketUrl: 'http://localhost:4444',
  isOfflineMode: true,
  endPoints: {
    userData: 'user-data',
    fileSource: 'mdclone/api/v1/file-source',
    templateByProject: 'mdclone/api/v1/template/get-by-project',
    uploadFileSource: 'mdclone/api/v1/upload/file-source',
    uploadHierarchy: 'mdclone/api/v1/upload/hierarchy',
    deleteFileSource: 'mdclone/api/v1/file-source',
    hierarchy: 'mdclone/api/v1/hierarchy',
    historyReport: 'mdclone/api/v1/session-history',
    downloadHierarchy: 'mdclone/api/v1/hierarchy/download',
    downloadHistoryReport: 'mdclone/api/v1/session-history/download',
    usageReport: 'mdclone/api/v1/reporting/usage',
    updateHierarchy: 'mdclone/api/v1/updateHierarchy',
    deleteHierarchy: 'mdclone/api/v1/hierarchy'
  }
};
