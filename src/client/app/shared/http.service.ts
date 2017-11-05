import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


@Injectable()
export class HttpService {

  constructor(private http: Http) {
  }

  post(data: any, url: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, data, options)
      .map((response: Response) => <any>response.json())
      .catch(this.handleError);
  }

  get(url: string): Observable<any> {
    return this.http.get(url)
      .map((response: Response) => <any>response.json())
      .catch(this.handleError);
  }

  put(url: string, body: any) {
    return this.http.put(url, body)
      .map((response: Response) => <any>response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    let errorAsJson;
    let errorToShow;
    try {
      errorAsJson = error.json();
      errorToShow = errorAsJson.error;
    } catch (exception) {
      //we could not parse the error as a json get the raw content of the error;
      errorToShow = error.text();
    }

    //this is just a generic handling of the error. we could handle this with a generic message to the user
    console.error(errorToShow);

    return Observable.throw(errorToShow || 'Server error');
  }
}
