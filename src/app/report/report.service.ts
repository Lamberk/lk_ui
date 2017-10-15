import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ReportsService {
  private reportUrl = 'https://api.kreditinfo.pro/lk/report';

  constructor(private http: Http) {
  }

  public getReports() {
    return this.http.get(this.reportUrl);
  }

  public createReport(fromValue, toValue) {
    console.log(fromValue);
    console.log(toValue);
    let postUrl = this.reportUrl + '?from=' + fromValue + '&to=' + toValue;
    return this.http.post(postUrl, {});
  }
}
