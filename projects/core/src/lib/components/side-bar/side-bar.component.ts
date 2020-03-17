import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';
import { SideMenu, MenuItem } from '../../common/side-menu';
import { ComponentService } from '../../services/component.service';
import { BaseSibscriber } from '../../common/BaseSibscriber';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'mdc-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent extends BaseSibscriber implements OnInit {

  constructor(private router: Router, public navigationService: NavigationService) {
    super();
  }

  items = SideMenu;

  ngOnInit() {
    super.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          ComponentService.scrollTo(0, 0);
        }
      }));
  }

  navigate(item: MenuItem): void {
    if (item.subLinks && item.subLinks.length) {
      item.showSubMenu = item.showSubMenu ? false : true;
      return;
    }
    if (!item.url) { return; }
    this.router.navigateByUrl(item.url);
  }

}
