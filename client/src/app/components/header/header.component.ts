import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('adminMode') adminMode : any
  @Input('isAuthenticated') isAuthenticated : any
  @Input('user') user : any

  selectedTab = 'home'
  

  constructor(public cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.adminMode = localStorage.getItem('adminMode') === 'true';
  }

  toggleAdminMode(e) {
    this.adminMode = e.checked;
    localStorage.setItem('adminMode', e.checked.toString());
    this.cd.detectChanges();
  }

  changedTab(tab) {
    this.selectedTab = tab;
  }


}
