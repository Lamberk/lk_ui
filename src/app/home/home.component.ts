import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { OverviewService } from '../overview/overview.service';
import { ReportsService } from '../report/report.service';
import * as $ from 'jquery';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'home',
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public success: number = 0;
  public fail: number = 0;
  public conversion: number = 0;
  public reports: any;

  constructor(private overviewService: OverviewService,
              private reportsService: ReportsService) {
  }

  public ngOnInit() {
    this.poll();

    let today = new Date();
    let currDate = today.getDate();
    let currMonth = today.getMonth() + 1;
    let currYear = today.getFullYear();
    let shortDate = (currDate + '/' + currMonth + '/' + currYear);
    let shortNextDate = ((currDate + 1) + '/' + currMonth + '/' + currYear);

    this.overviewService.getOverview(shortDate, shortNextDate)
      .subscribe((t) => {
        this.success = t.json().success;
        this.fail = t.json().fail;
        this.conversion = t.json().conversion;
      });

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let initData = [
      {id: '#from_datepicker', date: today},
      {id: '#to_datepicker', date: tomorrow},
      {id: '#report_from_datepicker', date: today},
      {id: '#report_to_datepicker', date: tomorrow}
    ];
    for (let data of initData) {
      this.initPicker(data.id, data.date);
    }
  }

  public initPicker(id: string, date): void {
    let $input = (<any>$(id)).pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 5, // Creates a dropdown of 15 years to control year
      format: 'dd/mm/yyyy'
    });
    let picker = $input.pickadate('picker');
    picker.set('select', date);
  }

  public getOverview(): void {
    let from = (<any>$('#from_datepicker')).pickadate();
    let fromPicker = from.pickadate('picker');
    let fromValue = fromPicker.get();
    let to = (<any>$('#to_datepicker')).pickadate();
    let toPicker = to.pickadate('picker');
    let toValue = toPicker.get('value');
    this.overviewService.getOverview(fromValue, toValue)
      .subscribe((overview) => {
        this.success = overview.json().success;
        this.fail = overview.json().fail;
        this.conversion = overview.json().conversion;
      });
  }

  public getReports() {
    this.reportsService.getReports()
      .subscribe((reports) => {
        this.reports = reports.json();
      });
  }

  public createReport() {
    let from = (<any>$('#report_from_datepicker')).pickadate();
    let fromPicker = from.pickadate('picker');
    let fromValue = fromPicker.get();
    let to = (<any>$('#report_to_datepicker')).pickadate();
    let toPicker = to.pickadate('picker');
    let toValue = toPicker.get('value');

    this.reportsService.createReport(fromValue, toValue)
      .subscribe((response) => {
        console.log(response.json());
    });
  }

  public poll() {
    setTimeout(() => {
      this.getReports();
      this.poll();
    }, 5000);
  }
}
