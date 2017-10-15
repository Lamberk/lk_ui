import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class OverviewService {
  private overviewUrl = 'https://api.kreditinfo.pro/lk/statistic';

  constructor(private http: Http) {
  }

  public getOverview(fromValue, toValue) {
    return this.http.get(this.overviewUrl + '?from=' + fromValue + '&to=' + toValue);
  }
}
