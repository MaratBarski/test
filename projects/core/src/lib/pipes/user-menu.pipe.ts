import { Pipe, PipeTransform } from '@angular/core';

import { MenuItem } from '../common/side-menu';
import { LoginService } from '../services/login.service';

@Pipe({
  name: 'userMenu'
})
export class UserMenuPipe implements PipeTransform {
  constructor(
    private loginService: LoginService
  ) { }

  transform(items: Array<MenuItem>, ...args: any[]): any {
    return this.loginService.filtermenu(items);
  }

}
