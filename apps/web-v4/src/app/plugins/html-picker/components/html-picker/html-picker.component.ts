/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'brace';
import 'brace/ext/language_tools';
import 'brace/mode/css';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/text';
import 'brace/snippets/css';
import 'brace/snippets/html';
import 'brace/snippets/javascript';
import 'brace/snippets/text';
import 'brace/theme/eclipse';
import 'brace/worker/css';
import 'brace/worker/html';
import 'brace/worker/javascript';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { IHtmlPicker } from '../../models/html-picker.model';
import { HtmlPickerService } from '../../services/html-picker.service';

@Component({
  selector: 'app-html-picker',
  templateUrl: './html-picker.component.html',
  styleUrls: ['./html-picker.component.scss']
})
export class HtmlPickerComponent implements OnInit {
  processedContent: IProcessedViewerContent;
  collectionId: string;
  newData: IHtmlPicker;
  options: any = {
    maxLines: 1000,
    printMargin: false,
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showInvisibles: true
  };
  constructor(private htmlPickerSvc: HtmlPickerService, private route: ActivatedRoute) {}
  paramSubscription;
  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
      this.onInItFunction();
    });
  }
  onInItFunction() {
    this.htmlPickerSvc.getHtmlPickerData(this.processedContent.content.artifactUrl).subscribe((data: IHtmlPicker) => {
      if (!data) {
        return;
      }
      this.newData = data;
      setTimeout(() => {
        this.update();
      }, 1000);
    });
  }

  onChange() {
    this.update();
  }

  update() {
    let htmlContent = this.newData.html || '';
    let cssContent = this.newData.css || '';
    let jsContent = this.newData.javascript || '';
    const cdnLinks = this.newData.cdnLinks || [];
    if (!this.newData.htmlPresent) {
      htmlContent = '';
    }
    if (!this.newData.cssPresent) {
      cssContent = '';
    }
    if (!this.newData.javascriptPresent) {
      jsContent = '';
    }
    while (htmlContent.indexOf('//') !== -1) {
      htmlContent =
        htmlContent.slice(0, htmlContent.indexOf('//')) +
        htmlContent.slice(htmlContent.indexOf('\n', htmlContent.indexOf('//')));
    }
    for (let i = 0; i < htmlContent.length; i++) {
      htmlContent = htmlContent.replace('\'', 'replacedPlaceHolder');
    }
    for (let i = 0; i < htmlContent.length; i++) {
      htmlContent = htmlContent.replace('replacedPlaceHolder', '\\\'');
    }
    for (let i = 0; i < cssContent.length; i++) {
      cssContent = cssContent.replace('\'', 'replacedPlaceHolder');
    }
    for (let i = 0; i < cssContent.length; i++) {
      cssContent = cssContent.replace('replacedPlaceHolder', '\\\'');
    }
    while (jsContent.indexOf('//') !== -1) {
      jsContent =
        jsContent.slice(0, jsContent.indexOf('//')) + jsContent.slice(jsContent.indexOf('\n', jsContent.indexOf('//')));
    }
    for (let i = 0; i < jsContent.length; i++) {
      jsContent = jsContent.replace('\'', 'replacedPlaceHolder');
    }
    for (let i = 0; i < jsContent.length; i++) {
      jsContent = jsContent.replace('replacedPlaceHolder', '\\\'');
    }
    // const htmlContentNew = htmlContent.replace('<', '<style>' + cssContent + '</style><');
    // const doc: HTMLIFrameElement = <HTMLIFrameElement>document.getElementById('my-output');
    // doc.src = 'javascript:\'' + htmlContentNew + '\<script>' + jsContent + '\<\/script>' + '\'';
    const doc: HTMLIFrameElement = document.getElementById('my-output') as HTMLIFrameElement;
    doc.src = 'javascript:\'' + htmlContent + '\'';
    const iframeDoc = doc.contentWindow.document;
    cdnLinks.forEach(ele => {
      if (ele.src) {
        const src = ele.src;
        // if ((document.getElementsByTagName('base')[0] || {})['href'].indexOf('localhost') < 0) {
        //   if (src.startsWith('http://')) {
        //     src.replace('http://', `${(document.getElementsByTagName('base')[0] || {})['href']}cdn/`);
        //   } else {
        //     src.replace('https://', `${(document.getElementsByTagName('base')[0] || {})['href']}cdn/`);
        //   }
        // }
        const child = iframeDoc.createElement(ele.type === 'css' ? 'link' : 'script');
        child.setAttribute(ele.type === 'css' ? 'href' : 'src', src);
        if (ele.type === 'css') {
          child.setAttribute('rel', 'stylesheet');
        }
        setTimeout(() => {
          iframeDoc.head.appendChild(child);
        });
      }
    });
    if (jsContent) {
      const executeJS = iframeDoc.createElement('script');
      const inlineScript = iframeDoc.createTextNode(this.newData.javascript);
      executeJS.appendChild(inlineScript);
      iframeDoc.body.appendChild(executeJS);
    }
    if (cssContent) {
      const css = iframeDoc.createElement('style');
      css.type = 'text/css';
      css.innerHTML = cssContent;
      iframeDoc.head.appendChild(css);
    }
  }
}
