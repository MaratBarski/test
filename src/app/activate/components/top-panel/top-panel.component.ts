import {Component, Input, OnInit} from '@angular/core';
import {FileSource} from '@app/models/file-source';

@Component({
  selector: 'md-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss']
})
export class TopPanelComponent implements OnInit {
  @Input() fileSource: FileSource;
  constructor() { }

  ngOnInit() {
  }

}
