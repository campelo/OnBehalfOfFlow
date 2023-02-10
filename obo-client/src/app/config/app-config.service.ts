import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IAppConfig } from './app-config.model';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  static settings: IAppConfig;
  constructor(private http: HttpClient) { }
  load() {
    const jsonFile = `assets/config/config.${environment.name}.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get<IAppConfig>(jsonFile)
        .subscribe({
          next: response => {
            AppConfigService.settings = <IAppConfig>response;
            resolve();
          },
          error: error =>
            reject(`Could not load file '${jsonFile}': ${JSON.stringify(error)}`)
        })
    });
  }
}
