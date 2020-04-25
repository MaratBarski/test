export const environment = {
  name: 'omry',
  production: false,
  serverUrl: 'http://10.0.2.18:4000/',
  // loginUrl: 'http://localhost:3000/login/',
  loginUrl: 'http://10.0.2.18:4000/login',
  socketUrl: 'http://localhost:5555/',
  isOfflineMode: false,
  endPoints: {
    userData: 'user-data',
    fileSource: 'omry/api/v1/file-source',
    uploadFileSource: 'omry/api/v1/upload/file-source',
    templateByProject: 'omry/api/v1/template/get-by-project',
    deleteFileSource: 'omry/api/v1/file-source',
    hierarchy: 'omry/api/v1/hierarchy',
    deleteHierarchy: 'omry/api/v1/hierarchy',
    downloadHierarchy: 'omry/api/v1/hierarchy/download',
    uploadHierarchy: 'omry/api/v1/upload/hierarchy',
    historyReport: 'omry/api/v1/session-history',
    downloadHistoryReport: 'omry/api/v1/session-history/download',
    usageReport: 'omry/api/v1/reporting/usage',
    updateHierarchy: 'omry/api/v1/updateHierarchy'
  }
};
