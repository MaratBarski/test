import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';
import { SideMenu, MenuItem } from '../../common/side-menu';

@Component({
  selector: 'mdc-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor(private router: Router, private activeRouter: ActivatedRoute) { }
  
  items = SideMenu;

  ngOnInit() {
    // this.activeRouter.data.subscribe(data => {
    //   alert(JSON.stringify(data));
    // })
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     alert(window.location.href);
    //   }
    // })
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
