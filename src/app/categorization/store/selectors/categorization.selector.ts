import { CategoryeResponse } from '@app/categorization/models/category-reponse';
import { Hierarchy } from '@app/models/hierarchy';

export const selectCategorization = (state: any): CategoryeResponse => state ? state.categorization : undefined;
export const selectData = (state: any): Array<Hierarchy> => state && state.categorization ? state.categorization.data : undefined;
