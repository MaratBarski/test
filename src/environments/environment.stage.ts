export const environment = {
  name: 'stage',
  production: true,
  serverUrl: 'http://10.0.2.41:4000/',
  //loginUrl: 'http://localhost:3000/login/',
  loginUrl: 'http://10.0.2.41:3000/login',
  socketUrl: 'http://localhost:4444',
  isOfflineMode: false,
  uiRoute: 'dev-stage',
  wsRoute: 'ws-stage',
  endPoints: {
    userData: 'user-data',
    fileSource: 'stage/api/v1/file-source',
    getRelationalIntegrity: 'stage/api/v1/file-source/get-relational-integrity',
    getSampleData: 'stage/api/v1/file-source/get-sample-data',
    templateByProject: 'stage/api/v1/template/get-by-project',
    siteEventInfo: 'stage/api/v1/siteeventinfo/get-by-project',
    uploadFileSource: 'stage/api/v1/upload/file-source',
    uploadHierarchy: 'stage/api/v1/upload/hierarchy',
    deleteFileSource: 'stage/api/v1/file-source',
    deleteCategory: 'stage/api/v1/hierarchy',
    downloadCategory: 'stage/api/v1/hierarchy/download',
    hierarchy: 'stage/api/v1/hierarchy',
    replaceHierarchy: 'stage/api/v1/upload/hierarchy',
    historyReport: 'stage/api/v1/session-history',
    downloadHistoryReport: 'stage/api/v1/session-history/download',
    usageReport: 'stage/api/v1/reporting/usage',
    updateHierarchy: 'stage/api/v1/hierarchy',
    config: 'stage/api/v1/config?msg=true',
    usageActiveUsage: 'stage/api/v1/reporting/usage-active-users',
    usageMonthlyUsage: 'stage/api/v1/reporting/usage-monthly-usage',
    usagePerUser: 'stage/api/v1/reporting/usage-per-user',
    usageTop10Users: 'stage/api/v1/reporting/usage-top-10-users',
    usageCreatedUsers: 'stage/api/v1/reporting/usage-created-users',
    usageSummaryTable: 'stage/api/v1/reporting/usage-summary-table',
    usageRetantionTable: 'stage/api/v1/reporting/usage-retention-list',
    usageCsvDownload: 'stage/api/v1/reporting/detailed-usage-report',
    userList: 'stage/api/v1/user',
    research: 'stage/api/v1/research',
    formKey: 'stage/api/v1/config/form-key',
    notificationUpdate: 'stage/api/v1/config/notification',
    project: 'stage/api/v1/project',
    patientStory: 'stage/api/v1/patient-story',
    patientStoryAbort: 'stage/api/v1/patient-story/abort',
    patientStoryUserSession: 'stage/api/v1/patient-story/user-session',
    hierarchyProject: 'stage/api/v1/hierarchy/project',
    patientStoryHierarchy: 'stage/api/v1/patient-story/hierarchy',
    patientStorySiteEventInfo: 'stage/api/v1/patient-story/events',
    adUsers: 'ad-users',
    job: 'stage/api/v1/job-sche'
  }
};