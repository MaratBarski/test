import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';
import { SideMenu, MenuItem } from '../../common/side-menu';
import { ComponentService } from '../../services/component.service';
import { BaseSibscriber } from '../../common/BaseSibscriber';

@Component({
  selector: 'mdc-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent extends BaseSibscriber implements OnInit {

  constructor(private router: Router, private activeRouter: ActivatedRoute) {
    super();
  }

  items = SideMenu;

  ngOnInit() {
    // this.activeRouter.data.subscribe(data => {
    //   alert(JSON.stringify(data));
    // })
    super.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          //alert(window.location.href);
          ComponentService.scrollTo(0, 0);
        }
      }));
  }

  isActive(item: MenuItem): boolean {
    return true;
  }

  navigate(item: MenuItem): void {
    if (item.subLinks && item.subLinks.length) {
      item.showSubMenu = item.showSubMenu ? false : true;
      return;
    }
    this.router.navigateByUrl(item.url);
  }

}
