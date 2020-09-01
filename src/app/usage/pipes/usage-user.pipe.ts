import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usageUser'
})
export class UsageUserPipe implements PipeTransform {

  transform(users: Array<any>, searchOption: { text: string }): any {
    if (!searchOption) { return users; }
    if (!searchOption.text) { return users; }
    searchOption.text = searchOption.text.trim().toLowerCase();
    return users.filter((user: any) => {
      const res = user.login && user.login.trim().toLowerCase().indexOf(searchOption.text) !== -1;
      // if (!res) {
      //   user.isChecked = false;
      // }
      return res;
    });
  }
}
