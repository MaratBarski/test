import { environment } from '@env/environment'

export function Offline(path: string): any {
    return (target, key: string) => {
        if (environment.isOfflineMode) {
            let _val = target[key];
            const getter = () => {
                return path;
            };
            const setter = (newVal: any) => {
                _val = newVal;
            };
            Object.defineProperty(target, key, {
                get: getter,
                set: setter
            });
        }
    };

}