import { Component, Input } from '@angular/core';
import { NavigationService } from '@appcore';
import { PermissionSetService } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() pageTitle = 'Add permission set';
  @Input() showLegend = true;
  @Input() showTitle = true;
  @Input() backUrl = 'users';
  //@Input() backText = 'Back to patient story settings';
  @Input() backText = 'Back to user list';

  constructor(
    public permissionSetService: PermissionSetService,
    private navigationService: NavigationService
  ) { }

  back(): void {
    this.navigationService.navigate(`/${this.backUrl}`);
  }

}
