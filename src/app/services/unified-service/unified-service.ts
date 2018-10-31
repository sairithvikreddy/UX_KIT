import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {appConstant} from '../../config/app-constants';

@Injectable()
export class UnifiedService {
  private unifiedUrl = environment.host + appConstant.profile;
  _unifiedServiceResponse: any;
  _callInProgress: any;

  constructor(private httpClient: HttpClient) {}

  public getData(): Observable<any> {
    if (this._unifiedServiceResponse) {
      return Observable.of(this._unifiedServiceResponse);
    } else if (this._callInProgress) {
      return this._callInProgress;
    } else {
      const body = {
        'profileType': 'max',
        'applicationId': 'IT',
        'search': true
      };
      let params = new HttpParams();
      params = params.set('version', appConstant.version);
      params = params.set('client_data', appConstant.client_data);

      const httpOptions = {
        params: params
      };

      this._callInProgress = this.httpClient.post(this.unifiedUrl, body, httpOptions).map((resp) => {
       this._unifiedServiceResponse = resp;
       this._callInProgress = false;
       return resp;
      }).catch((error: HttpErrorResponse) => {
        this._callInProgress = false;
        return this.handleError(error);
      }).share();
      return this._callInProgress;
    }
  }

  private handleError (error: HttpErrorResponse) {
    return Observable.throw(error.error || 'Internal Server error');
  }
}
