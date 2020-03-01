import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, Input } from '@angular/core';

@Component({
  selector: 'mdc-component-loader',
  templateUrl: './component-loader.component.html',
  styleUrls: ['./component-loader.component.css']
})
export class ComponentLoaderComponent implements OnInit {

  constructor(
    private loader: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  @Input() addItem: any;

  ngOnInit() {
    alert('load')
    this.loadComponent();
  }

  loadComponent() {
    //alert(this.addItem)
    //const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.addItem);
    const viewContainerRef = this.loader;
    viewContainerRef.clear();
    viewContainerRef.element.nativeElement = this.addItem;
    //const componentRef = viewContainerRef.createComponent(componentFactory);
    //this.addItem.load(componentRef.instance);
  }

}
