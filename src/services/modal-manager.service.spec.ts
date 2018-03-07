import { ModalManagerModule } from '../index';
import { ModalWindowComponent } from '../components/modal-window.component';
import { ModalManagerService } from './modal-manager.service';


describe('Modal Manager Service', () => {
    let modalManagerService : ModalManagerService;
    let modal1: ModalWindowComponent;
    let modal2: ModalWindowComponent;
    let modal3: ModalWindowComponent;
    let modal4: ModalWindowComponent;
    let modalIndexChangedSpy: jasmine.Spy;

    //Once the component has been compiled, synchronously initialize stuff before each test
    beforeEach(() => {
        //Store a reference to the injected modal manager service
        modalManagerService = new ModalManagerService();

        modal1 = new ModalWindowComponent(modalManagerService);
        modal2 = new ModalWindowComponent(modalManagerService);
        modal3 = new ModalWindowComponent(modalManagerService);
        modal4 = new ModalWindowComponent(modalManagerService);

        //Spy on the modalIndexChanged event
        modalIndexChangedSpy = spyOn(modalManagerService.modalIndexChanged, 'emit');
    });

    it('should properly handle adding and removing a few layered modals', (done: any) => {
        //Ensure that the startingZIndex is as expected without being explicitly set
        expect(modalManagerService.startingZIndex).toBe(100);

        //Add the first modal and ensure that its index is 0
        expect(modalManagerService.push(modal1)).toBe(0);
        /*
        Add the second modal to simulate layering a second modal on top of the first,
        and ensure that its index is 1 as expected.
        */
        expect(modalManagerService.push(modal2)).toBe(1);
        //Add a third modal on top of the first two and ensure that its index is 2
        expect(modalManagerService.push(modal3)).toBe(2);
        //Push the third model again to ensure that it's still at index 2
        expect(modalManagerService.push(modal3)).toBe(2);

        /*
        Remove the bottom modal and ensure that the index changed event was emitted
        as expected to decrement the indices of the modals above the removed modal.
        */
        modalManagerService.removeModal(modal1);
        expect(modalIndexChangedSpy).toHaveBeenCalledWith([modal2, 0]);
        expect(modalIndexChangedSpy).toHaveBeenCalledWith([modal3, 1]);
        expect(modalIndexChangedSpy).toHaveBeenCalledTimes(2);

        //Add modal4 to the top and ensure that its index is 2 as expected
        expect(modalManagerService.push(modal4)).toBe(2);
        
        /*
        Push the existing modal2, which was previously at the bottom, to
        the top.  Ensure that the indexChanged event is emitted to decrement
        the index of modal3 and modal4 as expected.
        */
        expect(modalManagerService.push(modal2)).toBe(2);
        expect(modalIndexChangedSpy).toHaveBeenCalledWith([modal3,0]);
        expect(modalIndexChangedSpy).toHaveBeenCalledWith([modal4,1]);
        expect(modalIndexChangedSpy).toHaveBeenCalledTimes(4);

        done();
    });
});

