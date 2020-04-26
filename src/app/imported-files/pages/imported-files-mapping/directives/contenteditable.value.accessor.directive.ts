import {Directive, forwardRef, Inject, OnInit, ElementRef, Renderer2, HostListener} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Directive({
  selector: '[contenteditable][formControlName],[contenteditable][formControl],[contenteditable][ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContenteditableValueAccessorDirective),
      multi: true
    }
  ]
})
export class ContenteditableValueAccessorDirective implements OnInit, ControlValueAccessor {
  value: string;
  // input text is equal to innerHtml of dom element
  @HostListener('input')
  onInput() {
    this.onChange(this.elementRef.nativeElement.innerHTML);
  }
  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }
  // function fired on every value changed
  private onChange: (value: string) => void = () => {
  };
  // function fired on every blur
  private onTouched = () => {
  };

  constructor(@Inject(ElementRef) private readonly elementRef: ElementRef,
              @Inject(Renderer2) private readonly renderer: Renderer2) {
  }

  ngOnInit() {
  }

  registerOnChange(fn: (value: string) => void = () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // disable is equal contenteditable = false
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'contenteditable',
      String(!isDisabled),
    );
  }

  writeValue(value: string): void {
    // input text is equal to innerHtml of dom element
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'innerHTML',
      ContenteditableValueAccessorDirective.normalizeValue(value),
    );
  }

  private static normalizeValue(value: string | null): string {
    const processed = value || '';
    return processed.trim() === '<br>' ? '' : processed;
  }
}
