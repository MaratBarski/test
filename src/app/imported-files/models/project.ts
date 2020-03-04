import { Site } from './site';
import { Hierarchy } from './hierarchy';
import { User } from 'src/app/shared/models/user';

export class Project  {
     projectId: number;
     projectName: string;
     defaultSiteId: number;
     site?: Site;
     hierarchy?: Array<Hierarchy>;
     users?: Array<User>;

}
