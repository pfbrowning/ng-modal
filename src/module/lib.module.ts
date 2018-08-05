
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalWindowComponent } from './components/modal-window.component';
import { ModalManagerService } from './services/modal-manager.service';

export * from './components/modal-window.component';
export * from './services/modal-manager.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ModalManagerService
  ],
  declarations: [
    ModalWindowComponent
  ],
  exports: [
    ModalWindowComponent
  ]
})
export class ModalManagerModule {}
