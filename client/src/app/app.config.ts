import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  GoogleInitOptions,
} from '@abacritt/angularx-social-login';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';

const googleLoginOptions: GoogleInitOptions = {
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
}; // https://developers.google.com/identity/oauth2/web/guides/use-token-model#initialize_a_token_client

const googleProvider = {
  provide: 'SocialAuthServiceConfig',
  useValue: {
    autoLogin: false,
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(
          '306926403104-fc62u100r760gct7de9hr3na6k83p0lj.apps.googleusercontent.com',
          googleLoginOptions,
        ),
      },
    ],
    onError: (err) => {
      console.error(err);
    },
  } as SocialAuthServiceConfig,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    googleProvider,
    provideHttpClient(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
  ],
};
