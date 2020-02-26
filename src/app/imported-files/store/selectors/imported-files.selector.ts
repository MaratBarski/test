export const selectFileSource = (state: any) => state ? state.fileSource : undefined;
export const selectData = (state: any) => state && state.fileSource ? state.fileSource.data : undefined;
