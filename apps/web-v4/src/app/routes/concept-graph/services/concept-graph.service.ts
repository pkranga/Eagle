/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConceptGraphService {
  constructor() {}

  findRelations(raw: any, type) {
    try {
      const links = [];
      let nodes = [];
      const data = this.deduplicatev2(raw, 'root');
      nodes = data.nodes;
      const idArray = data.idArray;
      raw.children.map((current, index) => {
        links.push({
          source: parseInt(raw.id, undefined),
          target: parseInt(current.id, undefined),
          type: 'high',
          level: 'root'
        });
      });
      raw.children.map((outerTopic, index) => {
        if (outerTopic.children && outerTopic.children.length > 0) {
          outerTopic.children.map(relatedTopics => {
            links.push({
              source: parseInt(outerTopic.id, undefined),
              target: parseInt(relatedTopics.id, undefined),
              type: 'high',
              level: 'second'
            });
          });
        } else {
          links.push({
            source: parseInt(raw.id, undefined),
            target: parseInt(outerTopic.id, undefined),
            type: 'high',
            level: 'one'
          });
        }
      });
      return {
        nodes,
        links
      };
    } catch (e) {
      throw e;
    }
  }

  deduplicatev2(topicsRelations: any, type) {
    try {
      const tempArray = Object.assign(topicsRelations.children);
      const firstLevelTopicIds = [parseInt(topicsRelations.id, undefined)];
      // first level will not have duplicates.
      tempArray.map(current => {
        firstLevelTopicIds.push(current.id);
      });
      tempArray.map(current => {
        const newArray = [];
        // check with first level ids, and dont add these to new array if exists in first level ids.
        if (current.children && current.children.length > 0) {
          current.children.map(innerCurrent => {
            if (firstLevelTopicIds.indexOf(innerCurrent.id) === -1) {
              newArray.push(innerCurrent);
            }
            // console.log(innerCurrent)
          });
          // replace children with de duplicated children.
          current.children = newArray;
        } else {
          current.children = [];
        }
      });

      // temp array has second first level dups.with parent per child. we will check now child vs child
      const secondLevelIds = [parseInt(topicsRelations.id, undefined)];
      tempArray.map(current => {
        const newChilds = [];
        if (current.children && current.children.length > 0) {
          current.children.map((innerCurrent, i) => {
            // if i=0 means its first childrens of first elem. we take thses as reference to de-duplicate from other children.
            if (i === 0) {
              secondLevelIds.push(innerCurrent.id);
              newChilds.push(innerCurrent);
            } else {
              // check with second level ids.
              if (secondLevelIds.indexOf(innerCurrent.id) === -1) {
                secondLevelIds.push(innerCurrent.id);
                newChilds.push(innerCurrent);
              }
            }
          });
          // /replace second level ids.
          current.children = newChilds;
        } else {
          current.children = [];
        }
      });

      // return new array
      const temp1 = topicsRelations;
      temp1.children = tempArray;
      // debugger;
      const idArr = [];
      let finalarray = [];
      idArr.push(temp1.id);
      const obj = {
        id: parseInt(temp1.id, undefined),
        // index:0,
        name: temp1.name,
        isRoot: true,
        level: 'high',
        node: 'root',
        count: 0
      };
      finalarray.push(obj);
      temp1.children.map(crr => {
        finalarray.push({
          id: crr.id,
          level: 'high',
          node: 'firstLevel',
          name: crr.name,
          count: 0
        });
        if (crr.children.length > 0) {
          crr.children.map(inr => {
            finalarray.push({
              id: inr.id,
              level: 'low',
              node: 'secondLevel',
              name: inr.name,
              count: 0
            });
          });
        }
      });
      const prefinalArray = [];
      const idArray = {};
      let count = 0;
      finalarray.map((current: any) => {
        if (idArray[current.id] === undefined) {
          idArray['' + current.id] = count;
          current.index = count;
          count += 1;
          prefinalArray.push(current);
        }
      });
      finalarray = Object.assign(prefinalArray);
      return {
        nodes: finalarray,
        idArray
      };
    } catch (e) {
      throw e;
    }
  }

  removeLinkAndNode(data: any) {
    try {
      const data1 = Object.assign(data);
      const data2 = {
        nodes: [],
        links: []
      };
      data1.nodes.forEach(element => {
        if (element.node !== 'secondLevel') {
          data2.nodes.push(element);
        }
      });
      data1.links.forEach(element => {
        if (element.level !== 'second') {
          data2.links.push(element);
        }
      });
      return data2;
    } catch (e) {
      throw e;
    }
  }
}
