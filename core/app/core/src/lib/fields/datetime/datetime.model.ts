import {NgbTimeStruct, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {DatetimeFormatter} from "../../services/formatters/datetime/datetime-formatter.service";

export class DateTimeModel {
    hourStep = 1;
    minuteStep = 15;
    secondStep = 30;
    displaySeconds: boolean = false;
    date: NgbDateStruct;
    time: NgbTimeStruct;

    public constructor(init?: Partial<DateTimeModel>) {
        Object.assign(this, init);
    }

    public static toDateTimeStruct(formatter, dateString: string): DateTimeModel | null {
        if (!dateString) {
            return null;
        }
        const dateTimeStruct = formatter.userDateTimeFormatToStruct(dateString);
        if (!dateTimeStruct) {
            return null;
        }
        const {date, time} = dateTimeStruct;
        return new DateTimeModel({
            date: date,
            time: time
        });

    }

    public toUserFormat(formatter: DatetimeFormatter): string {

        //prepare datetime string in yyyy-M-d H:m:s format (datetimepicker default)
        const dateString = [this.date.year, this.date.month, this.date.day].join('-');
        const timeString = [this.time.hour, this.time.minute, this.time.second].join(':');
        const datetimeString = [dateString, timeString].join(' ');

        //convert from yyyy-M-d H:m:s format to user format
        return formatter.toUserFormat(datetimeString, {fromFormat: 'yyyy-M-d H:m:s'});

    }
}
