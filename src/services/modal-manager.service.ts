import { Injectable, Output, EventEmitter } from '@angular/core';
import { ModalWindowComponent } from '../components/modal-window.component';

/** 
 * Maintains the indices of all active modal windows and reports index
 * changes to the relevant modals so that each modal can layer itself
 * accordingly with the correct z-index.
*/
@Injectable()
export class ModalManagerService {
    @Output() modalIndexChanged = new EventEmitter<[ModalWindowComponent, number]>();
    private activeModals = new Array<ModalWindowComponent>();
    private _startingZIndex : number = 100;

    /**
     * Returns the starting z-index so that the modal windows know where to put themselves
     */
    public get startingZIndex() : number {
        return this._startingZIndex;
    }

    /*
     * Allow the user to specify the starting z-index in case they have a reason
     * to need to show a modal at a z-index higher than 100.
    */
    public set startingZIndex(value : number) {
        this._startingZIndex = value;
    }

    /**
     * Pushes the provided modal to the top of the stack, if it's not already there, and
     * returns its index so that the component knows where to place itself via z-index
     * @param modal A reference to the the modal component instance that we want to register
     */
    public push(modal: ModalWindowComponent) : number {
        var modalIndex = this.activeModals.indexOf(modal);
        //If the modal isn't already on the stack, then simply push it to the top.
        if(modalIndex == -1) {
            this.activeModals.push(modal);
            return this.activeModals.indexOf(modal);
        }
        //If the modal is already on the top, then return the index without changing the array.
        else if(modalIndex == this.activeModals.length - 1) {
            return modalIndex;
        }
        //If the modal is on the stack, but not at the top, then remove it and re-add it at the top.
        else {
            this.removeModal(modal);
            this.activeModals.push(modal);
            return this.activeModals.indexOf(modal);
        }
    }

    /**
     * Removes the specified modal, if it exists.
     * @param modal The modal to remove
     */
    public removeModal(modal: ModalWindowComponent) : void {
        //Find the index of the modal
        var modalIndex = this.activeModals.indexOf(modal);
        if(modalIndex > -1) {
            //If the modal exists in the array, then remove it.
            this.activeModals.splice(modalIndex, 1);

            /*
            If we removed a modal which was not at the top of the stack,
            then inform each modal above the removed modal in the stack
            so that they can update their index and, by extension, z-index.
            */
            for(var i = modalIndex; i < this.activeModals.length; i++) {
                this.modalIndexChanged.emit([this.activeModals[i], i]);
            }
        }
    }
}