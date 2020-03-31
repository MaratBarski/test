import { ViewChild, ElementRef } from '@angular/core';

export abstract class BaseChart {
    @ViewChild('svg', { static: true }) svg: ElementRef;


    toBase64(): string {
        var xml = new XMLSerializer().serializeToString(this.svg.nativeElement);
        var svg64 = btoa(xml);
        var b64start = 'data:image/svg+xml;base64,';
        return b64start + svg64;
    }

    toImage(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve(img);
            }
            img.src = this.toBase64();
        });
    }

    download(width: number, height: number,fileName = 'Download.png'): void {
        const img = new Image();
        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = width; //this.width; // img.width;
            canvas.height = height; //this.height; // img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            //document.body.appendChild(canvas);

            let blob;
            if (img.src.indexOf(".jpg") > -1) {
                blob = canvas.toDataURL("image/jpeg");
            } else if (img.src.indexOf(".png") > -1) {
                blob = canvas.toDataURL("image/png");
            } else if (img.src.indexOf(".gif") > -1) {
                blob = canvas.toDataURL("image/gif");
            } else {
                blob = canvas.toDataURL("image/png");
            }
            let link = document.createElement('a');
            link.href = blob;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        img.src = this.toBase64();
    }
}
