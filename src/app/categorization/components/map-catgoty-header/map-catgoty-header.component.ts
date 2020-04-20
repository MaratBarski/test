import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'md-map-catgoty-header',
  templateUrl: './map-catgoty-header.component.html',
  styleUrls: ['./map-catgoty-header.component.scss']
})
export class MapCatgotyHeaderComponent implements OnInit {

  @Input() pageTitle = 'Map categories';
  @Input() data: any;
  hierarchyName = '';

  constructor() { }

  ngOnInit() {
  }

}
