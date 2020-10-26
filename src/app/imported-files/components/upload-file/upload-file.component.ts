import { Component, Output, EventEmitter, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { UploadService, UploadInfo } from '@app/shared/services/upload.service';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { SelectOption, SelectComponent, CsvManagerService, NotificationStatus, ValidationFileMessage, ToasterType, LoginService, BaseSibscriber, ExcelExtentions, ComponentService } from '@appcore';
import { environment } from '@env/environment';
import { ConfigService } from '@app/shared/services/config.service';
import { FileSource } from '@app/imported-files/models/file-source';


@Component({
  selector: 'md-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent extends BaseSibscriber implements OnInit {

  constructor(
    private csvManagerService: CsvManagerService,
    private uploadService: UploadService,
    private configService: ConfigService,
    private loginService: LoginService,
    private componentService: ComponentService
  ) {
    super();
  }

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  @ViewChild('templateSelector', { static: true }) templateSelector: SelectComponent;

  @Output() onCancel = new EventEmitter<void>();
  @Output() onUpload = new EventEmitter<void>();
  @Output() onLoad = new EventEmitter<UploadFileComponent>();

  @Input() targetComponent: any;
  @Input() set uploadUrl(uploadUrl: string) { this._uploadUrl = uploadUrl; }
  templates: Array<SelectOption>;
  get uploadUrl(): string { return this._uploadUrl; }
  defaultTemplate: SelectOption = { text: 'Select Permission Template...', id: '', value: '' };

  isFileError = false;
  fileType = false;
  project = '';
  fileName = '';
  file = '';
  fileErrorName = '';
  template = '';

  get isValid(): boolean {
    return !!this.fileName && !!this.project && !!this.file && !this.fileNameErrorMessage;
  }

  @Offline('http://localhost:44381/WeatherForecast/')
  private _uploadUrl = `${environment.serverUrl}${environment.endPoints.uploadFileSource}`;

  resetTemplate(): void {
    this.templateSelector.selected = undefined;
    this.template = '';
  }

  projects: Array<any>;

  ngOnInit(): void {
    this.onLoad.emit(this);
    super.add(
      this.loginService.onUserInfoUpdated.subscribe(ui => {
        if (!ui || !ui.data || !ui.data.projects) { return; }
        this.projects = ui.data.projects;
      }));
  }

  fileNameErrorMessage: string = undefined;

  validateFileName(): void {
    const files: Array<FileSource> = this.targetComponent.fileSource;
    const found = files.find(x => {
      return x.fileName && this.fileName && x.fileName.toLowerCase() === this.fileName.toLowerCase();
    });
    if (found) {
      this.fileNameErrorMessage = this.configService.config.fileValidationErrors[ValidationFileMessage.FileExists];
      this.fileName = '';
    } else {
      this.fileNameErrorMessage = undefined;
    }
  }

  uploadFile(event: any): void {
    event.preventDefault();

    if (!this.isValid) {
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', this.fileInput.nativeElement.files[0]);
    formData.append('fileName', this.fileName);
    formData.append('project', this.project);
    formData.append('fileType', this.fileType ? '1' : '0');
    formData.append('template', this.template);

    this.uploadService.addWithKey({
      notification: {
        name: 'Uploading Imported File',
        failName: 'Imported File Upload Failed',
        succName: 'Imported File Successfully Uploaded',
        abortName: 'Aborted Successfully',
        abortComment: `Upload of ${this.fileName} was successfully aborted.`,
        progressTitle: `${this.fileName}`,
        comment: 'You will be notified when it is ready for mapping.',
        succComment: 'The file uploaded successfully and is ready for mapping.',
        progress: 0,
        status: NotificationStatus.uploading,
        showProgress: true,
        containerEnable: true,
        startDate: new Date(),
        showInToaster: true,
        type: ToasterType.infoProgressBar,
        progressKf: 2
      },
      form: formData,
      url: this._uploadUrl,
      targetComponent: this.targetComponent,
      afterUpload: ((response: any, notifiuploadInfo: UploadInfo) => {
        notifiuploadInfo.notification.succLinkText = 'Map File';
        notifiuploadInfo.notification.succUrl = `imported-files/${response.data.fileSrc.fileId}`;
      })
    });
    this.reset();
    this.onUpload.emit();
  }

  changedProject(id: string): void {
    this.project = id;
    this.loadTemplates();
  }

  loadTemplates(): void {
    const proj = this.projects.find(x => x.projectId === this.project);
    if (proj) {
      this.templates = proj.template.map((x: any) => {
        return {
          id: x.templateId,
          text: x.templateName,
          value: x.templateId
        }
      });
    } else {
      this.templates = [];
    }
    this.resetTemplate();
  }

  changedTemplate(template: any): void {
    this.template = template.id;
  }

  cancel(event: any): void {
    this.reset();
    event.preventDefault();
    this.onCancel.emit();
  }

  reset(): void {
    this.fileName = '';
    this.file = '';
    this.fileErrorName = '';
    this.project = '';
    this.template = '';
    this.fileType = false;
    this.fileInput.nativeElement.value = '';
    this.isFileError = false;
    //this.fileUploader.reset();
  }

  private fileError(error: ValidationFileMessage, replacements: Array<any> = undefined): void {
    this.file = '';
    this.fileName = '';
    this.fileInput.nativeElement.value = '';
    this.isFileError = true;
    this.fileErrorMessage = this.configService.config.fileValidationErrors[error];
    if (replacements) {
      replacements.forEach(x => {
        this.fileErrorMessage = this.fileErrorMessage.replace(x[0], x[1]);
      })
    }
  }

  fileErrorMessage = '';

  updateFileName(event: any): void {
    this.fileErrorMessage = '';
    if (!this.fileInput.nativeElement.files.length) {
      return;
    }
    this.fileErrorName = this.fileInput.nativeElement.value;
    this.isFileError = false;
    if (!this.csvManagerService.validateFileExtention(this.fileInput.nativeElement, ExcelExtentions)) {
      this.fileError(ValidationFileMessage.CsvExtensionError);
      return;
    }
    if (!this.csvManagerService.validateFileName(this.fileInput.nativeElement)) {
      this.fileError(ValidationFileMessage.NoName);
      return;
    }
    if (!this.csvManagerService.validateMaxSize(this.fileInput.nativeElement.files[0], parseInt(this.configService.getValue('file_upload_limit')))) {
      this.fileError(ValidationFileMessage.FileSizeLimitError, [['{maxSize}', this.configService.getValue('file_upload_limit')]]);
      return;
    }
    if (!this.csvManagerService.validateFileEmpty(this.fileInput.nativeElement.files[0])) {
      this.fileError(ValidationFileMessage.FileEmpty);
      return;
    }
    if (!this.csvManagerService.validateFileSize(this.fileInput.nativeElement.files[0], 0, -1)) {
      this.fileError(ValidationFileMessage.FileSizeError);
      return;
    }

    this.csvManagerService.validate(this.fileInput.nativeElement.files[0]).then((res: ValidationFileMessage) => {
      if (res === ValidationFileMessage.Success) {
        this.csvManagerService.detectEncoding(this.fileInput.nativeElement.files[0]).then(encoding => {
          if (encoding.trim().toUpperCase() !== 'UTF8' && encoding.trim().toUpperCase() !== 'ASCII') {
            this.fileError(ValidationFileMessage.NoUtf8);
          } else {
            this.file = this.fileInput.nativeElement.value;
            this.fileName = this.componentService.getFileNameNoExt(this.file);
          }
        }).catch(e => {
          this.fileError(ValidationFileMessage.NoUtf8);
        });
        return;
      }
      this.fileError(res);
    }).catch(e => {
      this.fileError(ValidationFileMessage.OtherError);
    });
  }


  // csvHeaders: Array<string>;
  // @ViewChild('fileUploader', { static: true }) fileUploader: FileUploaderComponent;
  // onFileSelect(fileinfo: FileInput): void {
  //   this.csvHeaders = fileinfo.headers;
  // }
}
