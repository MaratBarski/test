export const environment = {
  name: 'marat',
  production: false,
  serverUrl: 'http://10.0.2.18:4000/',
  //loginUrl: 'http://localhost:3000/login/',
  loginUrl: 'http://10.0.2.18:3000/login',
  socketUrl: 'http://localhost:4444',
  isOfflineMode: !true,
  serverRoute: 'mdclone',
  uiRoute: '',
  wsRoute: 'ws-mdclone',
  endPoints: {
    userData: 'user-data',
    fileSource: 'mdclone/api/v1/file-source',
    getRelationalIntegrity: 'kostya/api/v1/file-source/get-relational-integrity',
    getSampleData: 'mdclone/api/v1/file-source/get-sample-data',
    templateByProject: 'mdclone/api/v1/template/get-by-project',
    siteEventInfo: 'mdclone/api/v1/siteeventinfo/get-by-project',
    uploadFileSource: 'mdclone/api/v1/upload/file-source',
    uploadHierarchy: 'mdclone/api/v1/upload/hierarchy',
    deleteFileSource: 'mdclone/api/v1/file-source',
    deleteCategory: 'mdclone/api/v1/hierarchy',
    downloadCategory: 'mdclone/api/v1/hierarchy/download',
    hierarchy: 'mdclone/api/v1/hierarchy',
    replaceHierarchy: 'mdclone/api/v1/upload/hierarchy',
    historyReport: 'mdclone/api/v1/session-history',
    downloadHistoryReport: 'mdclone/api/v1/session-history/download',
    usageReport: 'mdclone/api/v1/reporting/usage',
    updateHierarchy: 'mdclone/api/v1/hierarchy',
    config: 'mdclone/api/v1/config?msg=true',
    usageActiveUsage: 'mdclone/api/v1/reporting/usage-active-users',
    usageMonthlyUsage: 'mdclone/api/v1/reporting/usage-monthly-usage',
    usagePerUser: 'mdclone/api/v1/reporting/usage-per-user',
    usageTop10Users: 'mdclone/api/v1/reporting/usage-top-10-users',
    usageCreatedUsers: 'mdclone/api/v1/reporting/usage-created-users',
    usageSummaryTable: 'mdclone/api/v1/reporting/usage-summary-table',
    usageRetantionTable: 'mdclone/api/v1/reporting/usage-retention-list',
    usageCsvDownload: 'mdclone/api/v1/reporting/detailed-usage-report',
    userList: 'mdclone/api/v1/user',
    research: 'mdclone/api/v1/research',
    formKey: 'mdclone/api/v1/config/form-key',
    notificationUpdate: 'mdclone/api/v1/config/notification',
    project: 'mdclone/api/v1/project',
    patientStory: 'mdclone/api/v1/patient-story',
    patientStoryAbort: 'api/v1/patient-story/abort',
    patientStoryUpload: 'mdclone/api/v1/upload/patient-story',
    patientStoryUserSession: 'mdclone/api/v1/patient-story/user-session',
    hierarchyProject: 'mdclone/api/v1/hierarchy/project',
    patientStoryHierarchy: 'mdclone/api/v1/patient-story/hierarchy',
    adUsers: 'ad-users',
    activate: {
      base: 'mdclone/api/v1/activate',
      file: '/activate-file',
      calculate: '',
      originalFile: '/download-original'
    }
  }
};
