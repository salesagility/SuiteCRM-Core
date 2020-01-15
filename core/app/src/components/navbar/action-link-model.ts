import {LinkModel} from './link-model';
import {RecentRecordModel} from "./recent-record-model";

export interface ActionLinkModel {
    link: LinkModel;
    submenu?: Array<ActionLinkModel>;
    recentRecords?: Array<RecentRecordModel>;
}
