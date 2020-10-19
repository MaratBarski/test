// export const environment = {
//   name: 'kostyan',
//   production: false,
//   serverUrl: 'http://10.0.2.18:4000/',
//   // serverUrl: 'https://10.0.2.18:3000/',
//   // loginUrl: 'http://localhost:3000/login/',
//   loginUrl: 'https://10.0.2.18:3000/login',
//   // socketUrl: 'https://localhost:4444',
//   socketUrl: 'http://localhost:4444',
//   isOfflineMode: false,
//   uiRoute: 'kostya-the-king',
//   endPoints: {
//     userData: 'user-data',
//     fileSource: 'mdclone/api/v1/file-source',
//     getRelationalIntegrity: 'mdclone/api/v1/file-source/get-relational-integrity',
//     getSampleData: 'mdclone/api/v1/file-source/get-sample-data',
//     templateByProject: 'mdclone/api/v1/template/get-by-project',
//     uploadFileSource: 'mdclone/api/v1/upload/file-source',
//     uploadHierarchy: 'mdclone/api/v1/upload/hierarchy',
//     deleteFileSource: 'mdclone/api/v1/file-source',
//     deleteCategory: 'mdclone/api/v1/hierarchy',
//     downloadCategory: 'mdclone/api/v1/hierarchy/download',
//     hierarchy: 'mdclone/api/v1/hierarchy',
//     replaceHierarchy: 'mdclone/api/v1/upload/hierarchy',
//     historyReport: 'mdclone/api/v1/session-history',
//     downloadHistoryReport: 'moshe/api/v1/session-history/download',
//     usageReport: 'mdclone/api/v1/reporting/usage',
//     updateHierarchy: 'mdclone/api/v1/hierarchy',
//     config: 'mdclone/api/v1/config?msg=true',
//     usageActiveUsage: 'mdclone/api/v1/reporting/usage-active-users',
//     usageMonthlyUsage: 'mdclone/api/v1/reporting/usage-monthly-usage',
//     usagePerUser: 'mdclone/api/v1/reporting/usage-per-user',
//     usageTop10Users: 'mdclone/api/v1/reporting/usage-top-10-users',
//     usageCreatedUsers: 'mdclone/api/v1/reporting/usage-created-users',
//     usageSummaryTable: 'mdclone/api/v1/reporting/usage-summary-table',
//     usageRetantionTable: 'mdclone/api/v1/reporting/usage-retention-list',
//     usageCsvDownload: 'mdclone/api/v1/reporting/detailed-usage-report',
//     userList: 'mdclone/api/v1/user',
//     research: 'mdclone/api/v1/research'
//   }
// };

export const environment = {
  name: 'kostyan',
  production: false,
  // serverUrl: 'https://10.0.2.18:4000/',
  serverUrl: 'http://10.0.2.18:4000/',
  // loginUrl: 'https://10.0.2.18:4000/login',
  loginUrl: 'http://10.0.2.18:4000/login',
  socketUrl: 'https://localhost:4444',
  isOfflineMode: false,
  uiRoute: 'kostya-the-king',
  wsRoute: 'ws-kostya',
  endPoints: {
    userData: 'user-data',
    fileSource: 'kostya/api/v1/file-source',
    uploadFileSource: 'kostya/api/v1/upload/file-source',
    getSampleData: 'kostya/api/v1/file-source/get-sample-data',
    templateByProject: 'kostya/api/v1/template/get-by-project',
    siteEventInfo: 'kostya/api/v1/siteeventinfo/get-by-project',
    getRelationalIntegrity: 'kostya/api/v1/file-source/get-relational-integrity',
    uploadHierarchy: 'kostya/api/v1/upload/hierarchy',
    deleteFileSource: 'kostya/api/v1/file-source',
    deleteCategory: 'kostya/api/v1/hierarchy',
    downloadCategory: 'kostya/api/v1/hierarchy/download',
    hierarchy: 'kostya/api/v1/hierarchy',
    replaceHierarchy: 'kostya/api/v1/upload/hierarchy',
    historyReport: 'kostya/api/v1/session-history',
    downloadHistoryReport: 'kostya/api/v1/session-history/download',
    usageReport: 'kostya/api/v1/reporting/usage',
    updateHierarchy: 'kostya/api/v1/hierarchy',
    config: 'kostya/api/v1/config?msg=true',
    usageActiveUsage: 'kostya/api/v1/reporting/usage-active-users',
    usageMonthlyUsage: 'kostya/api/v1/reporting/usage-monthly-usage',
    usagePerUser: 'kostya/api/v1/reporting/usage-per-user',
    usageTop10Users: 'kostya/api/v1/reporting/usage-top-10-users',
    usageCreatedUsers: 'kostya/api/v1/reporting/usage-created-users',
    usageSummaryTable: 'kostya/api/v1/reporting/usage-summary-table',
    usageRetantionTable: 'kostya/api/v1/reporting/usage-retention-list',
    usageCsvDownload: 'kostya/api/v1/reporting/detailed-usage-report',
    userList: 'kostya/patientStoryUploadapi/v1/user',
    research: 'kostya/api/v1/research',
    formKey: 'kostya/api/v1/config/form-key',
    notificationUpdate: 'kostya/api/v1/config/notification',
    project: 'kostya/api/v1/project',
    patientStory: 'kostya/api/v1/file-source',
    patientStoryUpload: 'kostya/api/v1/upload/patient-story',
    patientStoryUserSession: 'kostya/api/v1/patient-story/user-session',
    hierarchyProject: 'kostya/api/v1/hierarchy/project',
    patientStoryHierarchy: 'kostya/api/v1/patient-story/hierarchy',
    adUsers: 'ad-users',
    activate: {
      base: 'kostya/api/v1/activate',
      file: '/activate-file',
      calculate: '',
      originalFile: '/download-original',
      nullsRate: '/nulls-rate',
      sampleData: '/get-sample-data',
      censoredRate: '/censored-rate',
      censoredFile: '/censored-file',
    }
  }
};
