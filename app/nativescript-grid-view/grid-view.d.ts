/*! *****************************************************************************
Copyright (c) 2019 Tangra Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************** */

import { EventData } from "tns-core-modules/data/observable";
import { ContainerView, KeyedTemplate, PercentLength, Template } from "tns-core-modules/ui/core/view";
import { ItemEventData, ItemsSource, TemplatedItemsView } from "tns-core-modules/ui/list-view";

export type Orientation = "horizontal" | "vertical";

export class GridView extends ContainerView implements TemplatedItemsView {
    static itemLoadingEvent: string;
    static itemTapEvent: string;
    static loadMoreItemsEvent: string;
    static scrollEvent: string;

    items: Array<any> | ItemsSource;
    itemTemplate: string | Template;
    itemTemplates: string | Array<KeyedTemplate>;
    rowHeight: PercentLength;
    colWidth: PercentLength;
    orientation: Orientation;

    ios: any; /* UICollectionView */
    android: any; /* android.support.v7.widget.RecyclerView */

    refresh();
    scrollToIndex(index: number, animated?: boolean);

    on(eventNames: string, callback: (data: EventData) => void, thisArg?: any);
    on(event: "itemLoading", callback: (args: GridItemEventData) => void, thisArg?: any);
    // tslint:disable-next-line:unified-signatures
    on(event: "itemTap", callback: (args: GridItemEventData) => void, thisArg?: any);
    on(event: "loadMoreItems", callback: (args: EventData) => void, thisArg?: any);
}

export interface GridItemEventData extends ItemEventData {
}

export interface ScrollEventData extends EventData {
    eventName: string;
    object: GridView;
    scrollX: number;
    scrollY: number;
}
