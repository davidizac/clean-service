import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  NgZone,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Pressing } from 'src/app/models/pressing.model';
import { PressingService } from 'src/app/services/pressing.service';
import * as geolib from 'geolib';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { MyEvent } from 'src/app/services/myevents.service';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';

@Component({
  selector: 'app-pressings',
  templateUrl: './pressings.component.html',
  styleUrls: ['./pressings.component.scss'],
})
export class PressingsComponent implements OnInit {
  pressings;
  displayedColumns: string[] = ['name', 'address', 'phoneNumber'];
  options = [];
  dataSource;
  address: FormControl;
  latitude;
  longitude;
  geolib = geolib;
  selectedPressings = [];
  location: FormControl;
  pageEvent: PageEvent;
  pageSize = 10;
  pressingDisplayed;
  isLoading = false;
  isAdmin: boolean;
  lang:string
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public formBuilder: FormBuilder,
    public pressingService: PressingService,
    private cd: ChangeDetectorRef,
    public router: Router,
    public ngZone: NgZone,
    private userService: UserService,
    public route:ActivatedRoute,
    private myEvent:MyEvent,
    private localize: LocalizeRouterService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(value => {
      this.lang = value['lang']
      this.myEvent.setLanguageData(this.lang);
    })
    this.location = this.formBuilder.control('');
    this.location.valueChanges.subscribe((e) => {
      this.triggerAutocomplete(e);
    });
    this.pressingService
      .getAllPressings()
      .pipe(
        switchMap((pressings: Array<Pressing>) => {
          this.pressings = pressings.map((p) => new Pressing(p));
          this.pressingDisplayed = _.cloneDeep(this.pressings).splice(
            0,
            this.pageSize
          );
          return this.userService.isAdmin();
        })
      )
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
  }

  triggerAutocomplete(value: string) {
    const filterValue = value.toLowerCase();

    const displaySuggestions = function (this, options, status) {
      this.options = options.map((p) => p.description);
      this.options.pop();
    };

    const service = new google.maps.places.AutocompleteService();
    service.getQueryPredictions(
      {
        input: filterValue,
      },
      displaySuggestions.bind(this)
    );
  }

  filterPressingsAroundMe(latitude, longitude) {
    const coordinates: any = geolib.orderByDistance(
      { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
      this.pressings.map((p) => {
        return {
          latitude: parseFloat(p.latitude),
          longitude: parseFloat(p.longitude),
        };
      })
    );

    this.pressings = coordinates.map((c) => {
      return this.pressings.find(
        (p) => p.latitude == c.latitude && p.longitude == c.longitude
      );
    });
    this.pressingDisplayed = _.cloneDeep(this.pressings).splice(
      0,
      this.pageSize
    );
    this.cd.detectChanges();
  }

  onSelectionChange(e) {
    const address = e.option.value;
    var geocoder = new google.maps.Geocoder();
    const navigate = function (this, results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
        this.filterPressingsAroundMe(this.latitude, this.longitude);
      }
    };
    geocoder.geocode(
      {
        address: address,
      },
      navigate.bind(this)
    );
  }

  getDistance(pressing: Pressing) {
    return this.geolib.getDistance(
      { latitude: this.latitude, longitude: this.longitude },
      { latitude: pressing.latitude, longitude: pressing.longitude }
    );
  }

  openPressing(pressing: Pressing) {
    this.selectedPressings.push(pressing._id);
    this.cd.detectChanges();
  }

  closePressing(pressing) {
    this.selectedPressings.splice(
      this.selectedPressings.findIndex((c) => c === pressing._id),
      1
    );
    this.cd.detectChanges();
  }

  isPressingOpened(pressing) {
    return this.selectedPressings.includes(pressing._id);
  }

  pageChanged(e) {
    const offset = (e.pageIndex + 1) * this.pageSize - this.pageSize;
    this.pressingDisplayed = _.cloneDeep(this.pressings).splice(
      offset,
      this.pageSize
    );
  }

  navigateToPressing(pressingId) {
    this.ngZone.run(() => {
      const route = this.localize.translateRoute(`/pressings/${pressingId}`);
      this.router.navigate([route]);
    });
  }

  deletePressing(pressingId) {
    this.pressingService.deletePressing(pressingId).subscribe(() => {
      this.pressingDisplayed = this.pressingDisplayed.filter(
        (p) => p._id !== pressingId
      );
    });
  }

  updatePressing(pressingId) {
    localStorage.setItem('adminMode', 'true');
    const route = this.localize.translateRoute(`/pressing-creator/${pressingId}`);
    this.router.navigate([route]);
  }
}
