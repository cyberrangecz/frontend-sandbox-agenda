import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SentinelAuthModule } from '@sentinel/auth';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SentinelConfirmationDialogComponent } from '@sentinel/components/dialogs';
import { SentinelLayout1Module } from '@sentinel/layout/layout1';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard } from '@sentinel/auth/guards';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [AppComponent, HomeComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SentinelLayout1Module,
        SentinelConfirmationDialogComponent,
        HttpClientModule,
        SentinelAuthModule.forRoot(environment.authConfig),
    ],
    providers: [SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard],
    bootstrap: [AppComponent],
})
export class AppModule {}
