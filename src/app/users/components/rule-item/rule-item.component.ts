import { Component, Input, EventEmitter, Output, HostListener } from '@angular/core';
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
  selectedEventName = '';

  fieldDescription = '';
  eventPropertyId = '';
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
    if (events.target.eventId === -1) { return; }

    this.selectedEvent = events.target.eventId;
    const foundEvent = this.eventsOptions.find(op => op.id === events.target.eventId);
    this.selectedEventName = foundEvent ? foundEvent.text : '';
    this.text = events.target.value;
    //this.fieldDescription = events.target.eventPropertyId;
    this.fieldDescription = events.target.eventPropertyText;
    this.eventPropertyId = events.target.eventPropertyId;
    const currentEvent = this._events.list.find(x => x.eventId === this.selectedEvent);
    this.propertyOptions = currentEvent.siteEventPropertyInfos.map((info, i) => {
      return {
        id: i,
        text: info.fieldDescription,
        value: info.eventPropertyName
      }
    });
    for (let i = 0; i < currentEvent.siteEventPropertyInfos.length; i++) {
      if (currentEvent.siteEventPropertyInfos[i].fieldDescription === this.fieldDescription) {
        this.selectedProperty = i;
        break;
      }
    }
  }

  private _events: any;

  remove(): void {
    this.onRemove.emit(this._events);
  }

  changed(): void {
    this._events.target.value = this.text;
    this._events.target.eventId = this.selectedEvent;
    //this._events.target.eventPropertyId = this.fieldDescription;
    this._events.target.eventPropertyText = this.fieldDescription;
    this._events.target.eventPropertyId = this.eventPropertyId;
    this.onChange.emit(this._events);
  }

  changedEvent(event: any): void {
    this.propertyOptions = this._events.list.find(x => x.eventId === event.id)
      .siteEventPropertyInfos.map((info, i) => {
        return {
          id: i,
          text: info.fieldDescription,
          value: info.eventPropertyName
        }
      });
    this.selectedProperty = -1;
    this.changed();
  }

  changedProperty(event: any): void {
    this.fieldDescription = event.text;
    this.eventPropertyId = event.value;
    this.changed();
  }

  searchEventText = '';
  isShowAllEvents = false;

  searchEvents(text: string): void {
    this.isShowAllEvents = false;
    this.searchEventText = text;
    this.selectedEventName = '';
    this.resetEvent();
  }

  searchPropertyText = '';
  isShowAllProperties = false;

  searchProperties(text: string): void {
    this.isShowAllProperties = false;
    this.searchPropertyText = text;
    this.selectedProperty = -1;
    this.fieldDescription = '';
    this.eventPropertyId = '';
    this.changed();
  }

  selectEvent(event: any): void {
    const ev = this._events.list.find(x => x.eventId === event.id);
    this.selectedEvent = event.id;
    this.selectedEventName = event.text;
    this.propertyOptions = ev
      .siteEventPropertyInfos.map((info, i) => {
        return {
          id: i,
          text: info.fieldDescription,
          value: info.eventPropertyName
        }
      });
    this.resetProperty();
    this.reinitPropertyOptions();
    this.changed();
  }

  resetEvent(): void {
    this.selectedEvent = -1;
    this.resetProperty();
  }

  showAllEvents(): void {
    this.isShowAllEvents = true;
  }

  showAllProperties(): void {
    this.isShowAllProperties = true;
  }

  resetProperty(): void {
    this.selectedProperty = -1;
    this.fieldDescription = '';
    this.eventPropertyId = ''
    this.searchPropertyText = '';
    this.propertyOptions = undefined;
    this.changed();
  }

  reinitPropertyOptions(): void {
    const props = this._events.list.find(x => x.eventId.toString() === this.selectedEvent.toString());
    if (!props) { return; }
    this.propertyOptions = props.siteEventPropertyInfos.map((info, i) => {
      return {
        id: i,
        text: info.fieldDescription,
        value: info.eventPropertyName
      }
    });
  }

  selectProperty(p: any): void {
    this.fieldDescription = p.text;
    this.selectedProperty = p.id;
    this.eventPropertyId = p.value;
    this.changed();
  }

  isEventExpanded = false;

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.isEventExpanded = false;
  }

  onExpanDisabled(): void {
    setTimeout(() => {
      this.selectedEventName = '';
      this.searchEventText = '';
      this.isEventExpanded = true;
    }, 10);
  }

}
