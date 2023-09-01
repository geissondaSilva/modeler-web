import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONFIGURATION, CONFIGURATION_DATA } from './tokens/configuration';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NewTableComponent } from './components/new-table/new-table.component';
import { FormsModule } from '@angular/forms';
import { ColControlDirective } from './directives/col-control.directive';
import { LineControlDirective } from './directives/line-control.directive';
import { CanvasDirective } from './directives/canvas.directive';

@NgModule({
  declarations: [
    AppComponent,
    NewTableComponent,
    ColControlDirective,
    LineControlDirective,
    CanvasDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
  ],
  providers: [
    { provide: CONFIGURATION, useValue: CONFIGURATION_DATA }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
