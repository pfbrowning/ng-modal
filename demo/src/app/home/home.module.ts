import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ModalManagerModule  } from '@browninglogic/ng-modal';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        CommonModule,
        ModalManagerModule,
        HomeRoutingModule,
    ],
    declarations: [HomeComponent],
})
export class HomeModule { }
