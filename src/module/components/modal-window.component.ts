import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalManagerService } from '../services/modal-manager.service';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';


@Component({
    selector: 'nm-modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls: [ './modal-window.component.css' ]
})

export class ModalWindowComponent implements OnInit, OnDestroy {
    /** Custom CSS class(es) to apply to the modal*/
    @Input() modalClass = '';
    /** Custom CSS class(es) to apply to the overlay*/
    @Input() overlayClass = '';
    /** Specifies whether the modal will close if the user clicks on the surrounding overlay */
    @Input() closeOnOverlayClick = true;
    /** Specifies whether to show the built-in close button */
    @Input() showCloseButton = false;
    /** Index of the modal on the global modal stack*/
    private modalIndex: number;
    /** Subscription to index change notifications from the modal manager service*/
    private subIndexChanged: Subscription;
    /** Visibility flag for internal use*/
    private _visible = false;

    /** Reports the visibility status of the modal window*/
    public get visible(): boolean {
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
        this.subIndexChanged = this.modalManagerService.modalIndexChanged.pipe(
            // We only care about changes to the modal's own index.
            filter(indexChange => indexChange[0] === this)
        ).subscribe(indexChange => this.onIndexChanged(indexChange[1]));
    }

    ngOnDestroy() {
        if (this.subIndexChanged) {
            this.subIndexChanged.unsubscribe();
        }
    }

    /**
     * Updates the local copy of the index when necessary so that the
     * corresponding z-index will be updated in the template.
     * @param newIndex new index provided by the modal management service
     */
    onIndexChanged(newIndex: number) {
        this.modalIndex = newIndex;
    }

    /** Provides the z-index to be used in the template for layering the modal */
    public get zIndex(): number {
        return this.modalIndex != null ? this.modalManagerService.startingZIndex + this.modalIndex : null;
    }

    /** Shows the modal and registers it with the modal manager */
    public show(): void {
        this.modalIndex  = this.modalManagerService.push(this);
        this._visible = true;
    }

    /** Hides the modal and de-registers it with the modal manager */
    public hide(): void {
        this.modalManagerService.removeModal(this);
        this._visible = false;
        this.modalIndex = null;
    }

    /**
     * Handles the click event when a user clicks on the overlay.
     * If the user clicked on the overlay and closeOnOverlayClick is enabled,
     * then close the modal.
     * @param event The mouse event provided by the browser
     */
    public onOverlayClicked(event: MouseEvent): void {
        if ((<HTMLElement>event.target).classList.contains('modalOverlay') && this.closeOnOverlayClick) {
            this.hide();
        }
    }
}
