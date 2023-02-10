import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        // Application (client) ID from the app registration
        clientId: '',
        // {CLOUD-INSTANCE}/{TENANT-INFO} The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers).
        //
        // {CLOUD-INSTANCE} This is the instance of the Azure cloud. For the main or global Azure cloud, enter https://login.microsoftonline.com. For national clouds (for example, China), see National clouds.
        //
        // {TENANT-INFO} Set to one of the following options: 
        // If your application supports accounts in this organizational directory, replace this value with the directory (tenant) ID or tenant name (for example, contoso.microsoft.com). 
        // If your application supports accounts in any organizational directory, replace this value with organizations. 
        // If your application supports accounts in any organizational directory and personal Microsoft accounts, replace this value with common. 
        // To restrict support to personal Microsoft accounts only, replace this value with consumers.
        authority: 'https://login.microsoftonline.com/',
        // This is your redirect URI
        redirectUri: 'http://localhost:4200'
      },
      cache: {
        cacheLocation: 'localStorage',
        // Set to true for Internet Explorer 11
        storeAuthStateInCookie: isIE
      }
    }), {
      // MSAL Guard Configuration
      interactionType: InteractionType.Redirect, 
      authRequest: {
        scopes: ['user.read']
      }
    }, {
      // MSAL Interceptor Configuration
      interactionType: InteractionType.Redirect,
      // Examples:
      //
      // ["user.read"] for Microsoft Graph
      // ["<Application ID URL>/scope"] for custom web APIs (that is, api://<Application ID>/access_as_user)
      protectedResourceMap: new Map([ 
          ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ])
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard
  ],
  bootstrap: [
    AppComponent,
    MsalRedirectComponent
  ]
})
export class AppModule { }
