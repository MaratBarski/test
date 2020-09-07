import { Component, Input, EventEmitter, Output } from '@angular/core';
import { SelectOption } from '@appcore';

@Component({
  selector: 'md-rule-item',
  templateUrl: './rule-item.component.html',
  styleUrls: ['./rule-item.component.scss']
})
export class RuleItemComponent {

  @Input() isShowerror = false;

  @Output() onRemove = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<any>();

  eventsOptions: Array<SelectOption>;
  selectedEvent = -1;

  fieldDescription = '';
  selectedProperty = -1;
  propertyOptions: Array<SelectOption>;
  text: string;

  @Input() set events(events: any) {
    this.eventsOptions = events.list.map(ev => {
      return {
        id: ev.eventId,
        text: ev.eventTableAlias,
        value: ev.eventId
      }
    });
    this._events = events;
  }

  private _events: any;

  remove(): void {
    this.onRemove.emit(this._events);
  }

  changed(): void {
    this._events.target.value = this.text;
    this._events.target.eventId = this.selectedEvent;
    this._events.target.eventPropertyId = this.fieldDescription;
    this.onChange.emit(this._events);
  }

  changedEvent(event: any): void {
    this.propertyOptions = this._events.list.find(x => x.eventId === event.id)
      .siteEventPropertyInfos.map((info, i) => {
        return {
          id: i,
          text: info.fieldDescription,
          value: info.fieldDescription
        }
      });
    this.selectedProperty = -1;
    this.changed();
  }

  changedProperty(event: any): void {
    this.fieldDescription = event.text;
    this.changed();
  }

}
