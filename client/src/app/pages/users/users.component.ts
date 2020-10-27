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
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users;
  displayedColumns: string[] = ['fullname', 'email'];
  options = [];
  dataSource;

  selectedUsers = [];
  filter: FormControl;
  pageEvent: PageEvent;
  pageSize = 10;
  usersDisplayed;
  isLoading = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public formBuilder: FormBuilder,
    public usersService: UserService,
    private cd: ChangeDetectorRef,
    public router: Router,
    public ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.filter = this.formBuilder.control('');
    this.filter.valueChanges.subscribe((e) => {
      if (this.users.length) {
        if (e) {
          this.usersDisplayed = this.users.filter((o) => {
            return (
              (o.email.match(e) || []).length > 0 ||
              (o.fullname.toLowerCase().match(e.toLowerCase()) || []).length > 0
            );
          });
        } else {
          this.usersDisplayed = this.users;
        }
      }
    });
    this.usersService.getAll().subscribe((users: any) => {
      this.isLoading = false;
      this.users = users;
      this.usersDisplayed = _.cloneDeep(this.users).splice(0, this.pageSize);
    });
  }

  openUser(user) {
    this.selectedUsers.push(user._id);
    this.cd.detectChanges();
  }

  closeUser(user) {
    this.selectedUsers.splice(
      this.selectedUsers.findIndex((c) => c === user._id),
      1
    );
    this.cd.detectChanges();
  }

  isUserOpened(user) {
    return this.selectedUsers.includes(user._id);
  }

  pageChanged(e) {
    const offset = (e.pageIndex + 1) * this.pageSize - this.pageSize;
    this.usersDisplayed = _.cloneDeep(this.users).splice(offset, this.pageSize);
  }
}
