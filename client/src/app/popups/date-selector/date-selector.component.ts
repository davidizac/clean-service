import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

let moment = extendMoment(Moment);

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
})
export class DateSelectorComponent implements OnInit {
  result: Subject<Date> = new Subject<Date>();

  moments = [];
  selectedMoment: any;
  selectedHourRange: any;
  hourRanges = [];
  dropOffDate;
  pickUpDate;
  isPickup;
  endDate;
  startDate;
  constructor(public bsModalRef: BsModalRef, public cd:ChangeDetectorRef) {}

  ngOnInit() {
    moment.locale('fr');
    this.pickUpDate =
      typeof this.pickUpDate === 'string'
        ? moment(this.pickUpDate)
        : this.pickUpDate;
    this.dropOffDate =
      typeof this.dropOffDate === 'string'
        ? moment(this.dropOffDate)
        : this.dropOffDate;
    if (this.isPickup) {
      if (this.dropOffDate) {
        this.startDate = moment();
        this.endDate = this.dropOffDate.clone();
        this.endDate.subtract(2, 'days');
      } else {
        this.startDate = moment();
        this.endDate = moment().add(17, 'day');
      }
    } else {
      if (this.pickUpDate) {
        this.startDate = this.pickUpDate.clone();
        this.endDate = this.pickUpDate.clone();
        this.startDate.add(2, 'days');
        this.endDate.add(19, 'days');
      } else {
        this.startDate = moment();
        this.startDate.add(3, 'days');
        this.endDate = moment().add(17, 'day');
      }
    }
    const range = moment.range(this.startDate, this.endDate);
    this.moments = Array.from(
      range.by('day', { excludeEnd: true, step: 1 })
    )
    this.changedDate(this.moments[0])
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  onConfirm() {
    this.result.next(
      this.selectedMoment.hours(parseInt(this.selectedHourRange)).minutes(0)
    );
    this.closeModal();
  }

  changedDate(moment2) {
    this.selectedMoment = moment2;
    if (moment().format('YYYY-MM-DD') === moment2.format('YYYY-MM-DD') && !moment().add(2,'hours').isAfter(moment().hours(21))) {
      const range2 = moment.range(moment().add(2,'hours'), moment().hours(22));
      const hours = Array.from(
        range2.by('hour', { excludeEnd: false, step: 1 })
      );
      this.hourRanges = hours.map((m: any) => m.format('HH') + ':00');
    }
    else if (moment2.day() === 5) {
      if (moment().format('YYYY-MM-DD') === moment2.format('YYYY-MM-DD') && !moment().add(2,'hours').isAfter(moment().hours(12))) {
        const range2 = moment.range(moment().add(2,'hours'), moment().hours(22));
        const hours = Array.from(
          range2.by('hour', { excludeEnd: false, step: 1 })
        );
        this.hourRanges = hours.map((m: any) => m.format('HH') + ':00');
      }
      else{
        const range2 = moment.range(moment().hours(10), moment().hours(13));
        const hours = Array.from(
          range2.by('hour', { excludeEnd: false, step: 1 })
        );
        this.hourRanges = hours.map((m: any) => m.format('HH') + ':00');
      }
    } else {
      const range2 = moment.range(moment().hours(17), moment().hours(22));
      const hours = Array.from(
        range2.by('hour', { excludeEnd: false, step: 1 })
      );
      this.hourRanges = hours.map((m) => m.format('HH') + ':00');
    }
    this.cd.detectChanges()
  }

  changedHour(hourRange) {
    this.selectedHourRange = hourRange;
  }
}
