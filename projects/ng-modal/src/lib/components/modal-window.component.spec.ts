import { TestBed, getTestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ModalManagerModule } from '../modal-manager.module';
import { ModalWindowComponent } from './modal-window.component';
import { ModalManagerService } from '../services/modal-manager.service';


describe('Modal Window Component', () => {
    let injector: TestBed;
    let modalManagerService: ModalManagerService;
    let modalFixture: ComponentFixture<ModalWindowComponent>;
    let modalInstance: ModalWindowComponent;
    let onIndexChangedSpy: jasmine.Spy;
    let hideSpy: jasmine.Spy;
    let pushSpy: jasmine.Spy;
    let removeModalSpy: jasmine.Spy;
    let overlayDiv: any;
    let modalWindowDiv: any;
    let modalCloseBtn: DebugElement;

    // Asynchronously fetch and compile the component
    beforeEach(async(() => {
        // Init the testbed
        TestBed.configureTestingModule({
            imports: [ ModalManagerModule ],
            providers: [
                ModalManagerService,
            ]
        })
        .compileComponents();
    }));

    // Once the component has been compiled, synchronously initialize stuff before each test
    beforeEach(() => {
        injector = getTestBed();
        // Store references to the relevant injected services
        modalManagerService = injector.get(ModalManagerService);

        // Store references to the testing fixture and the component instance
        modalFixture = TestBed.createComponent(ModalWindowComponent);
        modalInstance = modalFixture.componentInstance;

        // Spy to ensure that these methods are caled exactly as we expect
        onIndexChangedSpy = spyOn(modalInstance, 'onIndexChanged').and.callThrough();
        hideSpy = spyOn(modalInstance, 'hide').and.callThrough();
        pushSpy = spyOn(modalManagerService, 'push').and.callThrough();
        removeModalSpy = spyOn(modalManagerService, 'removeModal').and.callThrough();

        // Initiate the component
        modalFixture.detectChanges();

        // Query for ui elements to manipulate
        overlayDiv = modalFixture.debugElement.query(By.css('.nm-modal-overlay')).nativeElement;
        modalWindowDiv = modalFixture.debugElement.query(By.css('.nm-modal-window')).nativeElement;
    });

    it('should initialize properly in the standard case', () => {
        // Ensure that everything is as expected after a standard init
        expect(modalInstance.closeOnOverlayClick).toBe(true);
        expect(modalInstance.showCloseButton).toBe(false);
        expect(modalInstance.visible).toBe(false);
        expect(modalInstance.zIndex).toBeNull();
        expect(onIndexChangedSpy).not.toHaveBeenCalled();
    });

    it('should properly handle a simple show and hide', () => {
        modalInstance.show();
        modalFixture.detectChanges();

        // Expect that the component is visible with a z-index of 1000 after show
        expect(modalInstance.visible).toBe(true);
        expect(modalInstance.zIndex).toBe(1000);
        expect(overlayDiv.style['z-index']).toBe('1000');
        expect(overlayDiv.style.display).toBe('block');
        expect(pushSpy).toHaveBeenCalledTimes(1);

        // Hide the component and ensure that all is as expected
        modalInstance.hide();
        modalFixture.detectChanges();
        expect(modalInstance.visible).toBe(false);
        expect(overlayDiv.style.display).toBe('none');
        expect(modalInstance.zIndex).toBeNull();
        expect(removeModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should properly handle the modalIndexChanged event', () => {
        const modal2 = new ModalWindowComponent(modalManagerService);

        modalInstance.show();
        modalFixture.detectChanges();

        expect(modalInstance.visible).toBe(true);
        expect(modalInstance.zIndex).toBe(1000);
        expect(overlayDiv.style['z-index']).toBe('1000');
        expect(overlayDiv.style.display).toBe('block');

        /*
        Ensure that the index is properly updated when modalIndexChanged
        is emitted for this modal window
        */
        modalManagerService.modalIndexChanged.emit([modalInstance, 4]);
        modalFixture.detectChanges();
        expect(onIndexChangedSpy).toHaveBeenCalledTimes(1);
        expect(modalInstance.zIndex).toBe(1004);
        expect(overlayDiv.style['z-index']).toBe('1004');
        expect(overlayDiv.style.display).toBe('block');

        /*
        Ensure that the index is NOT updated when modalIndexChanged is emitted
        for a different modal window
        */
        modalManagerService.modalIndexChanged.emit([modal2, 17]);
        modalFixture.detectChanges();
        expect(onIndexChangedSpy).toHaveBeenCalledTimes(1);
        expect(modalInstance.zIndex).toBe(1004);
        expect(overlayDiv.style['z-index']).toBe('1004');
        expect(overlayDiv.style.display).toBe('block');
    });

    it('should properly handle a custom starting z-index', () => {
        modalManagerService.startingZIndex = 2000;

        modalInstance.show();
        modalFixture.detectChanges();

        expect(modalInstance.visible).toBe(true);
        expect(modalInstance.zIndex).toBe(2000);
        expect(overlayDiv.style['z-index']).toBe('2000');
        expect(overlayDiv.style.display).toBe('block');
    });

    it('should close on overlay click when closeOnOverlayClick is true', () => {
        modalInstance.show();
        modalFixture.detectChanges();

        // Check that the window is visible
        expect(modalInstance.visible).toBe(true);
        expect(overlayDiv.style.display).toBe('block');

        // Click the overlay
        overlayDiv.dispatchEvent(new Event('click'));
        modalFixture.detectChanges();

        // Check that the window was properly closed
        expect(hideSpy).toHaveBeenCalledTimes(1);
        expect(modalInstance.visible).toBe(false);
        expect(overlayDiv.style.display).toBe('none');
    });

    it('should not close on overlay click when closeOnOverlayClick is false', () => {
        // Turn closeOnOverlayClick off before showing the window
        modalInstance.closeOnOverlayClick = false;
        modalInstance.show();
        modalFixture.detectChanges();

        // Check that the window is visible
        expect(modalInstance.visible).toBe(true);
        expect(overlayDiv.style.display).toBe('block');

        // Click the overlay
        overlayDiv.dispatchEvent(new Event('click'));
        modalFixture.detectChanges();

        // Ensure that the window has not been closed
        expect(hideSpy).not.toHaveBeenCalled();
        expect(modalInstance.visible).toBe(true);
        expect(overlayDiv.style.display).toBe('block');
    });

    it('should show the close button when showCloseButton is true', () => {
        // Turn on showCloseButton and show the modal
        modalInstance.showCloseButton = true;
        modalInstance.show();
        modalFixture.detectChanges();

        // Check to ensure that the close button DOM element IS present
        modalCloseBtn = modalFixture.debugElement.query(By.css('.nm-modal-close-btn'));
        expect(modalCloseBtn.nativeElement).not.toBeNull();
    });

    it('should not show the close button when showCloseButton is false', () => {
        // Turn off showCloseButton and show the modal
        modalInstance.showCloseButton = false;
        modalInstance.show();
        modalFixture.detectChanges();

        // Check to ensure that the close button DOM element is NOT present
        modalCloseBtn = modalFixture.debugElement.query(By.css('.nm-modal-close-btn'));
        expect(modalCloseBtn).toBeNull();
    });

    it('should close the modal when showCloseButton is true and the user clicks the close button', () => {
        // Turn on showCloseButton and show the modal
        modalInstance.showCloseButton = true;
        modalInstance.show();
        modalFixture.detectChanges();

        // Check to ensure that the close button is present in the DOM
        expect(overlayDiv.style.display).toBe('block');

        // Simulate a click on the overlay div
        modalCloseBtn = modalFixture.debugElement.query(By.css('.nm-modal-close-btn'));
        modalCloseBtn.nativeElement.dispatchEvent(new Event('click'));
        modalFixture.detectChanges();

        // Check to ensure that the close button is no longer visible
        expect(overlayDiv.style.display).toBe('none');
    });

    it('should properly apply provided modalClass and overlayClass', () => {
        // Apply custom CSS classes as input properties
        modalInstance.overlayClass = 'overlayDummyClass1 overlayDummyClass2';
        modalInstance.modalClass = 'modalDummyClass1 modalDummyClass2';
        modalFixture.detectChanges();

        // Ensure that the CSS is properly applied to the DOM
        expect(overlayDiv.getAttribute('class')).toBe('nm-modal-overlay overlayDummyClass1 overlayDummyClass2');
        expect(modalWindowDiv.getAttribute('class')).toBe('nm-modal-window modalDummyClass1 modalDummyClass2');
    });

    it('should unsubscribe the subIndexChanged subscription on destroy without erroring out', () => {
        // Init the test component
        modalFixture.detectChanges();

        // Destroy the test component to ensure that no error is thrown
        modalFixture.destroy();
    });
});


