import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { GlobalService } from 'src/app/services/global.service';

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
  constructor(public bsModalRef: BsModalRef, public cd: ChangeDetectorRef, public globalService: GlobalService) { }

  ngOnInit() {
    if (this.globalService.langGlobal == 'il') {
      moment.locale('he');
    }
    else if (this.globalService.langGlobal == 'en') {
      moment.locale('en');
    }
    else if (this.globalService.langGlobal == 'fr') {
      moment.locale('fr');
    }
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
        console.log(this.startDate);

        this.endDate = this.dropOffDate.clone();

        if (moment(this.dropOffDate).day() == 0) {
          this.endDate.subtract(3, 'days');
        } else if (moment(this.dropOffDate).day() == 6) {
          this.endDate.subtract(2, 'days');
        } else {
          this.endDate.subtract(1, 'days');
        }

      } else {
        this.startDate = moment();
        this.endDate = moment().add(17, 'day');
      }
    } else {
      if (this.pickUpDate) {
        this.startDate = this.pickUpDate.clone();
        this.endDate = this.pickUpDate.clone();
        if (moment(this.pickUpDate).day() == 4) {
          this.startDate = this.startDate.add(3, 'days');
        } else if (moment(this.pickUpDate).day() == 5) {
          this.startDate = this.startDate.add(2, 'days');
        } else {
          this.startDate = this.startDate.add(1, 'days');
        }
        this.endDate = this.endDate.add(19, 'days');
      } else {
        this.startDate = moment();
        if (moment(this.startDate).day() == 4) {
          this.startDate = this.startDate.add(3, 'days');
        } else if (moment(this.startDate).day() == 5) {
          this.startDate = this.startDate.add(2, 'days');
        } else {
          this.startDate = this.startDate.add(1, 'days');
        }
        this.endDate = moment().add(17, 'day');
      }
    }
    const range = moment.range(this.startDate, this.endDate);

    this.moments = Array.from(
      range.by('day', { excludeEnd: true, step: 1 })
    )

    this.changedDate(this.moments[0], true)
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  onConfirm() {

    if (this.selectedHourRange) {
      this.result.next(
        this.selectedMoment.hours(parseInt(this.selectedHourRange)).minutes(0)
      );
    }

    this.closeModal();
  }

  changedDate(moment2, notFromUserclick?) {

    this.selectedMoment = moment2;
    // if (moment().format('YYYY-MM-DD') === moment2.format('YYYY-MM-DD') && !moment().add(2, 'hours').isAfter(moment().hours(21))) {

    if (moment2.day() === 5) {
      if (moment().format('YYYY-MM-DD') === moment2.format('YYYY-MM-DD') && !moment().add(2, 'hours').isAfter(moment().hours(12))) {

        let range2
        if (moment().add(2, 'hours').isBefore(moment().hours(18))) {
          range2 = moment.range(moment().hours(18), moment().hours(22));
        } else {
          range2 = moment.range(moment().add(2, 'hours'), moment().hours(22));
        }
        const hours = Array.from(
          range2.by('hour', { excludeEnd: false, step: 2 })
        );
        this.hourRanges = hours.map((m: any) => m.format('HH') + ':00');
      }
      else {
        let range2 = moment.range(moment().hours(9), moment().hours(11));
        const hours = Array.from(
          range2.by('hour', { excludeEnd: false, step: 2 })
        );
        this.hourRanges = hours.map((m: any) => m.format('HH') + ':00');
        if (notFromUserclick) {
          this.moments.shift()
        }
      }
    } else if (moment2.day() === 6) {
      if (moment().format('YYYY-MM-DD') === moment2.format('YYYY-MM-DD') && !moment().add(2, 'hours').isAfter(moment().hours(12))) {
        let range2
        if (moment().add(2, 'hours').isBefore(moment().hours(18))) {
          range2 = moment.range(moment().hours(18), moment().hours(22));
        } else {
          range2 = moment.range(moment().add(2, 'hours'), moment().hours(22));
        }

        const hours = Array.from(
          range2.by('hour', { excludeEnd: false, step: 2 })
        );
        this.hourRanges = hours.map((m: any) => m.format('HH') + ':00');
      }
      else {
        let range2 = moment.range(moment().hours(21), moment().hours(22));
        const hours = Array.from(
          range2.by('hour', { excludeEnd: false, step: 2 })
        );
        this.hourRanges = hours.map((m: any) => m.format('HH') + ':00');
        if (notFromUserclick) {
          this.moments.shift()
        }
      }
    }
    else {
      if (moment().format('YYYY-MM-DD') === moment2.format('YYYY-MM-DD') && !moment().add(2, 'hours').isAfter(moment().hours(21))) {
        let range2
        if (moment().add(2, 'hours').isBefore(moment().hours(18))) {
          range2 = moment.range(moment().hours(18), moment().hours(22));
        } else {
          range2 = moment.range(moment().add(2, 'hours'), moment().hours(22));
        }

        const hours = Array.from(
          range2.by('hour', { excludeEnd: false, step: 2 })
        );
        this.hourRanges = hours.map((m: any) => m.format('HH') + ':00');
      } else {
        let range2 = moment.range(moment().hours(18), moment().hours(22));

        const hours = Array.from(
          range2.by('hour', { excludeEnd: false, step: 2 })
        );

        this.hourRanges = hours.map((m) => m.format('HH') + ':00');
        if (notFromUserclick) {
          this.moments.shift()
        }
      }

    }
    this.cd.detectChanges()
  }

  changedHour(hourRange) {
    this.selectedHourRange = hourRange;
  }
}
