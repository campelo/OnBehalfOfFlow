import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../config/app-config.service';
import { AccessToken } from '../../dto/access-token';

@Injectable({
  providedIn: 'root'
})
export class MiddleTierService {

  constructor(private http: HttpClient) { }

  getOboToken(): Observable<AccessToken> {
    return this.http.get<AccessToken>(AppConfigService.settings.api.uri);
  }

}
