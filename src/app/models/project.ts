import { Site } from './site';
import { Hierarchy } from './hierarchy';
import { User } from 'core/lib/models/UserInfo';

export class Project  {
     projectId: number;
     projectName: string;
     defaultSiteId: number;
     site?: Site;
     hierarchy?: Array<Hierarchy>;
     users?: Array<User>;
}
