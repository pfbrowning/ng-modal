import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalManagerService } from '../services/modal-manager.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls: [ './modal-window.component.css' ]
})

export class ModalWindowComponent implements OnInit, OnDestroy {
    //Allow the user to specify custom CSS classes for the modal
    @Input() modalClass : string = '';
    //Allow the user to specify custom CSS classes for the overlay
    @Input() overlayClass : string = '';
    //Should the user be able to manually close the window?
    @Input() allowClose : boolean = true;
    //Index of this modal on the global modal stack
    private modalIndex : number;
    private subIndexChanged : Subscription;
    private _visible : boolean = false;

    /**
     * Reports the visibility status of the modal window
     */
    public get visible() : boolean {
        return this._visible;
    }

    constructor (
        public modalManagerService: ModalManagerService
    ) {}

    ngOnInit() {
        /*
        Subscribe to changes of this modal's index on the global modal stack
        so that this modal can accurately maintain its z-index
        with relation to other layered modal windows
        */
        this.subIndexChanged = this.modalManagerService.modalIndexChanged
            //We're selfish: we only care about changes to the modal's own index.
            .filter(indexChange => indexChange[0] == this)
            .subscribe(indexChange => this.onIndexChanged(indexChange[1]));
    }

    ngOnDestroy() {
        if(this.subIndexChanged) {
            this.subIndexChanged.unsubscribe();
        }
    }

    /**
     * When the index changes, update it so that the corresponding z-index will be updated.
     * @param newIndex new index provided by the modal management service
     */
    onIndexChanged(newIndex : number) {
        this.modalIndex = newIndex;
    }

    /**
     * Layer the z-index according to the modal index
     * reported by the modal manager so that more-recently-opened
     * modals show on top of older modal instances.
     */
    public get zIndex() : number {
        return this.modalIndex != null ? this.modalManagerService.startingZIndex + this.modalIndex : null;
    }

    /**
     * Show the modal and register it with the modal manager
    */
    public show() : void {
        this.modalIndex  = this.modalManagerService.push(this);
        this._visible = true;
    }

    /**
     * Hide the modal and de-register it with the modal manager
    */
    public hide() : void {
        this.modalManagerService.removeModal(this);
        this._visible = false;
        this.modalIndex = null;
    }

    /**
     * If the user clicked on the outside overlay and we're 
     * allowing closing, then close the modal.
     * @param event The mouse event provided by the browser
     */
    public onOverlayClicked(event: MouseEvent) : void {
        if((<HTMLElement>event.target).classList.contains('modalOverlay') && this.allowClose) {
            this.hide();
        }
    }
}