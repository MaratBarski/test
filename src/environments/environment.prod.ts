export const environment = {
  name:'prod',
  production: true,
  serverUrl: 'http://localhost:3000/',
  loginUrl: 'http://10.0.2.18:3000/login',
  socketUrl: 'http://localhost:4444',
  isOfflineMode: false,
  endPoints: {
    userData: 'user-data',
    fileSource: 'mdclone/api/v1/file-source',
    uploadFileSource: 'mdclone/api/v1/upload/file-source',
    deleteFileSource: 'mdclone/api/v1/file-source',
    hierarchy: 'mdclone/api/v1/hierarchy',
    historyReport: 'mdclone/api/v1/session-history'
  }
};
