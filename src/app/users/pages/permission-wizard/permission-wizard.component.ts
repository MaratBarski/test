import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { PermissionSetService, NO_ALLOWED_EVENTS } from '@app/users/services/permission-set.service';
import { TabWizardItem } from '@app/users/components/tabs/tabs.component';
import { NavigationService, BaseNavigation } from '@appcore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'md-permission-wizard',
  templateUrl: './permission-wizard.component.html',
  styleUrls: ['./permission-wizard.component.scss']
})
export class PermissionWizardComponent extends BaseNavigation implements OnInit, AfterViewInit {

  showCancelConfirm = false;
  @Input() confirmOnChanges = true;
  @Input() showLegend = true;
  @Input() isPopup = false;
  @Input() isFromClient = false;
  @Output() onSave = new EventEmitter<any>();
  @Output() onLoad = new EventEmitter<PermissionWizardComponent>();
  @Output() onCancel = new EventEmitter();
  pageTitle = 'Add permission set';

  get showChangesConfirm(): boolean {
    return this.permissionSetService.showCancelConfirm;
  }

  ngAfterViewInit(): void {
    this.onLoad.emit(this);
  }

  isOfflineMode = false;

  setOffline(ps: any): void {
    this.isOfflineMode = true;
    setTimeout(() => {
      this.permissionSetService.setOffline(ps);
    }, 1);
  }

  constructor(
    public permissionSetService: PermissionSetService,
    private activatedRoute: ActivatedRoute,
    protected navigationService: NavigationService,
    private router: Router
  ) {
    super(navigationService);
    super.add(this.permissionSetService.onAllowedEventsChange.subscribe(() => {
      this.update3Tab();
    }))
  }

  get isLastTab():boolean{
    return this.permissionSetService.selectedTab === 1;
  }

  private update3Tab(): void {
    this.tabs[2].isDisabled = false;
    if (this.permissionSetService.permissionSet.allowedEvent === NO_ALLOWED_EVENTS) {
      this.tabs[2].isDisabled = true;
      return;
    }
    if (!this.permissionSetService.templates || !this.permissionSetService.templates.length) {
      this.tabs[2].isDisabled = true;
    }
  }

  afterStep1init(): void {
    this.update3Tab();
  }

  get isNextEnable(): boolean {
    if (this.tabs[2].isDisabled && this.permissionSetService.selectedTab === 1) {
      return false;
    }
    return this.permissionSetService && this.permissionSetService.selectedTab === 1;
  }

  tabs: Array<TabWizardItem> = [
    {
      text: 'General Details'
    },
    {
      text: 'Allowed Events'
    },
    {
      text: 'Allowed Cohort',
      isOptional: true,
      isDisabled: this.permissionSetService.permissionSet && this.permissionSetService.permissionSet.allowedEvent === NO_ALLOWED_EVENTS
    }
  ];

  cancelSave(): void {
    this.showCancelConfirm = false;
  }

  confirmSave(): void {
    this.showCancelConfirm = false;
    if (this.isFromClient) {
      this.onSave.emit(this.permissionSetService.getSet());
      return;
    }
    this.permissionSetService.save();
  }

  clear(): void {
    this.permissionSetService.resetService(0);
  }

  ngOnInit(): void {
    //this.permissionSetService.resetService(0);
    if (this.confirmOnChanges) {
      this.navigationService.beforeNavigate = ((url: string) => {
        if (url) {
          this.permissionSetService.redirectUrl = url;
        }
        if (this.permissionSetService.isHasChanges()) {
          this.permissionSetService.showCancelConfirm = !!url;
          return true;
        }
        if (url) {
          this.router.navigateByUrl(url);
        }
      });
    }
    super.add(
      this.activatedRoute.paramMap.subscribe(u => {
        const id = parseInt(u.get('id') || '0');
        this.pageTitle = id ? 'Edit permission set' : 'Add permission set';
        this.permissionSetService.resetService(id);
        this.permissionSetService.isPopup = this.isPopup;
      }));
  }

  cancel(): void {
    if (this.isOfflineMode) {
      this.onCancel.emit();
      return;
    }
    this.permissionSetService.cancel();
  }

  next(i: number): void {
    this.permissionSetService.nextTab(i);
  }

  save(): void {
    this.permissionSetService.isAfterValidate = true;
    if (this.permissionSetService.permissionSet.allowedEvent === NO_ALLOWED_EVENTS) {
      if (!this.permissionSetService.validate(true)) { return; }
      this.showCancelConfirm = true;
      return;
    }
    if (this.isFromClient) {
      this.onSave.emit(this.permissionSetService.getSet());
      return;
    }
    this.permissionSetService.save();
  }

  selectNextTab(index: number): void {
    if (!this.permissionSetService.validate(true)) {
      this.permissionSetService.isAfterValidate = true;
      return;
    }
    this.permissionSetService.setTab(index);
  }

  cancelChanges(): void {
    this.permissionSetService.showCancelConfirm = false;
  }

  confirmChanges(): void {
    this.permissionSetService.cancelConfirm();
  }
}

