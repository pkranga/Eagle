/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  Renderer,
  ViewChild,
  ElementRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatOption } from '@angular/material';
import { Subscription, interval } from 'rxjs';
import { IClassDiagramResponse, IOptionsObject, IClassDiagramApiResponse } from '../../model/classDiagram.model';
import { map } from 'rxjs/operators';
import { jsPlumb, jsPlumbInstance } from 'jsplumb';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { ClassDiagramService } from '../../services/class-diagram.service';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { deepCopy } from '../../../../utils/deepCopy';

@Component({
  selector: 'app-class-diagram',
  templateUrl: './class-diagram.component.html',
  styleUrls: ['./class-diagram.component.scss']
})
export class ClassDiagramComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('classDiagramContainer', { static: true }) classDiagramContainer: ElementRef;
  @Input()
  processedContent: IProcessedViewerContent;
  @Input() collectionId: string;

  clsDiagramData: IClassDiagramResponse;
  clsDiagramStartedAt: number;
  clsDiagramTimeRemaining: number;
  jsPlumbInstance;
  classCount = 0;
  isSubmitted = false;
  isDisabled = false;
  isIdeal = false;
  result: IClassDiagramApiResponse;
  error = false;
  public selectedAccess = 'public';
  public selectedRelation = 'is-a';
  private tmpListener: any;
  userOptions: IOptionsObject = { classes: [], relations: [] };

  classOptions: string[] = [];
  private timerSubscription: Subscription;
  private notifierTimerSubscription: Subscription;
  constructor(
    private domSanitizer: DomSanitizer,
    private el: ElementRef,
    private renderer: Renderer,
    private clsDiagramSvc: ClassDiagramService
  ) { }

  ngOnInit() {
    this.tmpListener = this.renderer.listen(this.classDiagramContainer.nativeElement, 'dragover', event => {
      event.preventDefault();
    });
    this.tmpListener = this.renderer.listen(this.classDiagramContainer.nativeElement, 'drop', event => {
      // tslint:disable-next-line:max-line-length
      if (
        !['statemachine-class-diagram', 'card-pile'].includes(event.target.id) &&
        !event.target.classList.contains('new-class')
      ) {
        this.drop(event);
        return false;
      }
    });
    this.tmpListener = this.renderer.listen(this.classDiagramContainer.nativeElement, 'click', event => {
      if (event.target.className === 'drag-icon') {
        this.jsPlumbRemoved(event);
      } else if (event.target.nodeName === 'LI') {
        this.removeListItems(event);
      }
    });
    this.fireTelemetry('LOADED');
  }

  ngAfterViewInit() {
    // setup some defaults for jsPlumb.
    this.jsPlumbInstance = jsPlumb.getInstance({
      Endpoint: 'Dot',
      Connector: 'StateMachine',
      HoverPaintStyle: { stroke: '#1e8151', strokeWidth: 2 },
      ConnectionOverlays: [
        [
          'Arrow',
          {
            location: 1,
            id: 'arrow',
            length: 14,
            foldback: 0.8
          }
        ],
        ['Label', { label: '', id: 'label', cssClass: 'aLabel' }]
      ],
      Container: 'statemachine-class-diagram'
    });

    this.jsPlumbInstance.registerConnectionType('basic', { anchor: 'Continuous', connector: 'StateMachine' });
  }

  ngOnChanges() {
    this.ngOnDestroy();
    this.initializeClassDiagram();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.notifierTimerSubscription) {
      this.notifierTimerSubscription.unsubscribe();
    }
  }

  private initializeClassDiagram() {
    this.clsDiagramData = deepCopy(this.processedContent.classDiagram);
    this.clsDiagramData.safeProblemStatement = this.sanitize(this.clsDiagramData.problemStatement);
    this.clsDiagramData.timeLimit *= 1000;
    this.clsDiagramData.options.classes.forEach(value => {
      this.classOptions.push(value.name.substr(0, 1).toLocaleLowerCase() + value.name.substr(1));
    });
    this.classOptions.sort(() => Math.random() - 0.5);
    this.clsDiagramStartedAt = Date.now();
    this.clsDiagramTimeRemaining = this.clsDiagramData.timeLimit;
    if (this.clsDiagramData.timeLimit > -1) {
      this.timerSubscription = interval(100)
        .pipe(map(() => this.clsDiagramStartedAt + this.clsDiagramData.timeLimit - Date.now()))
        .subscribe(exerciseTimeRemaining => {
          this.clsDiagramTimeRemaining = exerciseTimeRemaining;
          if (this.clsDiagramTimeRemaining < 0) {
            this.isIdeal = true;
            this.clsDiagramTimeRemaining = 0;
            this.timerSubscription.unsubscribe();
            this.submit();
          }
        });
    }
    this.notifierTimerSubscription = interval(30 * 1000).subscribe(() => {
      this.fireTelemetry('RUNNING');
    });
  }

  addClass() {
    this.classCount++;
    const addClass =
      '<div data-class-id="' +
      this.classCount +
      '" class="class-container class' +
      this.classCount +
      '" ><div class="class-name" id="cls' +
      this.classCount +
      '">ClassName </div><div class="attributes" id="attr' +
      this.classCount +
      '" >Attributes</div><div class="methods" id="mtds' +
      this.classCount +
      '" >Methods</div></div>';

    const container = document.createElement('div');
    container.classList.add('new-class');
    const icon = document.createElement('div');
    icon.classList.add('drag-icon');
    container.appendChild(icon);
    const newDiv = document.createElement('div');
    newDiv.innerHTML = addClass;
    container.insertBefore(newDiv, icon);
    document.getElementsByClassName('statemachine-class-diagram')[0].appendChild(container);
    this.jsPlumbInitialization(this.jsPlumbInstance, container);
  }

  jsPlumbInitialization(instance, element) {
    const windows = instance.getSelector('.statemachine-class-diagram .new-class');
    instance.draggable(element, { containment: 'statemachine-class-diagram' });

    // suspend drawing and initialise.
    instance.batch(() => {
      instance.makeSource(element, {
        filter: '.drag-icon',
        anchor: 'AutoDefault',
        connectorStyle: { stroke: '#5c96bc', strokeWidth: 2, outlineStroke: 'transparent', outlineWidth: 4 },
        connectionType: 'basic'
      });

      instance.makeTarget(element, {
        dropOptions: { hoverClass: 'dragHover' },
        anchor: 'AutoDefault',
        allowLoopback: true
      });

      instance.bind('click', c => {
        instance.deleteConnection(c);
      });

      instance.bind('connection', info => {
        info.connection.getOverlay('label').setLabel(this.selectedRelation);
      });
    });
  }

  drag(ev) {
    ev.dataTransfer.setData('text', ev.target.textContent);
  }

  drop(event) {
    let data = event.dataTransfer.getData('text').trim();
    event.target.id = event.target.id ? event.target.id : event.target.offsetParent.id;
    if (event.target.id.indexOf('cls') > -1) {
      const clsName = data.substring(0, 1).toLocaleUpperCase() + data.substring(1);
      document.getElementById(event.target.id).innerHTML = '';
      document.getElementById(event.target.id).innerHTML = '<ul><li class="text-center">' + clsName + '</li></ul>';
    } else {
      const access = this.selectedAccess === 'public' ? '+ ' : this.selectedAccess === 'private' ? '- ' : '# ';
      data = access + data;
      if (document.getElementById(event.target.id).getElementsByTagName('ul').length > 0) {
        document.getElementById(event.target.id).getElementsByTagName('ul')[0].innerHTML += '<li>' + data + '</li>';
      } else {
        document.getElementById(event.target.id).innerHTML = '<ul><li>' + data + '</li></ul>';
      }
    }
  }

  jsPlumbRemoved(event) {
    const id = event.target.offsetParent.id;
    const classDiagramDiv = document.getElementById('statemachine-class-diagram');
    this.jsPlumbInstance.select({ source: id + '' }).delete();
    this.jsPlumbInstance.select({ target: id + '' }).delete();
    classDiagramDiv.removeChild(event.target.parentNode);
  }

  removeListItems(event) {
    const parent = event.target.offsetParent.id;
    if (event.target.parentNode.childNodes.length === 1) {
      if (parent.indexOf('attr') >= 0) {
        document.getElementById(parent).innerHTML = 'Attributes';
      } else if (parent.indexOf('mtds') >= 0) {
        document.getElementById(parent).innerHTML = 'Methods';
      } else {
        document.getElementById(parent).innerHTML = 'Class Name';
      }
    } else {
      event.target.parentNode.removeChild(event.target);
    }
  }

  submit() {
    this.isSubmitted = true;
    this.isDisabled = true;
    this.result = null;
    this.userOptions.classes = [];
    this.userOptions.relations = [];
    const classElements = document.getElementsByClassName('new-class');
    if (classElements.length) {
      for (let i = 0; i < classElements.length; i++) {
        //  const id = classElements[i].getElementsByClassName('class-container')[0].classList[1].substring(5);
        const id = classElements[i].getElementsByClassName('class-container')[0].getAttribute('data-class-id');
        const exists = document.getElementById('cls' + id).getElementsByTagName('li');
        const className = exists.length ? exists[0].innerText.trim() : '';
        this.userOptions.classes.push({
          name: className,
          type: 'class',
          belongsTo: '',
          access: ''
        });
        const attr = document.getElementById('attr' + id).getElementsByTagName('li');
        if (attr.length) {
          for (let j = 0; j < attr.length; j++) {
            const attributeValue = attr[j].innerText.trim();
            // tslint:disable-next-line:max-line-length
            const accessSpecifier =
              attributeValue.substring(0, 1) === '+'
                ? 'public'
                : attributeValue.substring(0, 1) === '-'
                  ? 'private'
                  : 'protected';
            this.userOptions.classes.push({
              name: attributeValue.substring(1).trim(),
              type: 'attribute',
              belongsTo: className,
              access: accessSpecifier
            });
          }
        }
        const method = document.getElementById('mtds' + id).getElementsByTagName('li');
        if (method.length) {
          for (let j = 0; j < method.length; j++) {
            const methodValue = method[j].innerText.trim();
            // tslint:disable-next-line:max-line-length
            const accessSpecifier =
              methodValue.substring(0, 1) === '+'
                ? 'public'
                : methodValue.substring(0, 1) === '-'
                  ? 'private'
                  : 'protected';
            this.userOptions.classes.push({
              name: methodValue.substring(1).trim(),
              type: 'method',
              belongsTo: className,
              access: accessSpecifier
            });
          }
        }
      }
      this.jsPlumbInstance.select().each(info => {
        // const sourceId = info.source.getElementsByClassName('class-container')[0].classList[1].substring(5);
        // const targetId = info.target.getElementsByClassName('class-container')[0].classList[1].substring(5);
        const sourceId = info.source.getElementsByClassName('class-container')[0].getAttribute('data-class-id');
        const targetId = info.target.getElementsByClassName('class-container')[0].getAttribute('data-class-id');

        const sourceClass = document.getElementById('cls' + sourceId).getElementsByTagName('li');
        const targetClass = document.getElementById('cls' + targetId).getElementsByTagName('li');

        if (sourceClass.length && targetClass.length) {
          const object = {
            source: sourceClass[0].innerText.trim(),
            relation: info.getOverlay('label').getLabel(),
            target: targetClass[0].innerText.trim()
          };
          this.userOptions.relations.push(object);
        }
      });

      if (this.userOptions.classes.length) {
        const requestData = {
          identifier: this.processedContent.content.identifier,
          userSolution: this.userOptions
        };

        this.clsDiagramSvc.submitClassDiagram(requestData).subscribe(
          res => {
            this.result = res;
            this.error = false;
            this.fireTelemetry('DONE');
            this.isSubmitted = false;
            this.isDisabled = false;
          },
          err => {
            this.error = true;
            this.isDisabled = false;
          }
        );
      }
    } else {
      this.isDisabled = false;
    }
  }

  reset() {
    this.selectedAccess = 'public';
    this.selectedRelation = 'is-a';
    document.getElementById('statemachine-class-diagram').innerHTML = '';
    this.jsPlumbInstance.deleteEveryConnection();
    this.userOptions.classes = [];
    this.userOptions.relations = [];
    this.result = null;
    this.isSubmitted = false;
    this.isDisabled = false;
    this.error = false;
  }

  fireTelemetry(status) {
    this.clsDiagramSvc.firePlayerTelemetryEvent(
      this.processedContent.content.identifier,
      this.collectionId,
      MIME_TYPE.classDiagram,
      status,
      this.isIdeal,
      this.isSubmitted
    );
  }

  private sanitize(htmlString: string) {
    return this.domSanitizer.bypassSecurityTrustHtml(htmlString);
  }
}
