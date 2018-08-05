import { TestBed, getTestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalManagerModule } from '../lib.module';
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
    let modalCloseBtn;

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
        overlayDiv = modalFixture.debugElement.query(By.css('.modalOverlay')).nativeElement;
        modalCloseBtn = modalFixture.debugElement.query(By.css('.modalCloseBtn')).nativeElement;
    });

    it('should initialize properly in the standard case', () => {
        // Ensure that everything is as expected after a standard init
        expect(modalInstance.allowClose).toBe(true);
        expect(modalInstance.visible).toBe(false);
        expect(modalInstance.zIndex).toBeNull();
        expect(onIndexChangedSpy).not.toHaveBeenCalled();
    });

    it('should properly handle a simple show and hide', () => {
        modalInstance.show();

        // Expect that the component is visible with a z-index of 100 after show
        expect(modalInstance.visible).toBe(true);
        expect(modalInstance.zIndex).toBe(100);
        expect(pushSpy).toHaveBeenCalledTimes(1);

        // Hide the component and ensure that all is as expected
        modalInstance.hide();
        expect(modalInstance.visible).toBe(false);
        expect(modalInstance.zIndex).toBeNull();
        expect(removeModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should properly handle the modalIndexChanged event', () => {
        const modal2 = new ModalWindowComponent(modalManagerService);

        modalInstance.show();

        expect(modalInstance.visible).toBe(true);
        expect(modalInstance.zIndex).toBe(100);

        /*
        Ensure that the index is properly updated when modalIndexChanged
        is emitted for this modal window
        */
        modalManagerService.modalIndexChanged.emit([modalInstance, 4]);
        expect(onIndexChangedSpy).toHaveBeenCalledTimes(1);
        expect(modalInstance.zIndex).toBe(104);

        /*
        Ensure that the index is NOT updated when modalIndexChanged is emitted
        for a different modal window
        */
        modalManagerService.modalIndexChanged.emit([modal2, 17]);
        expect(onIndexChangedSpy).toHaveBeenCalledTimes(1);
        expect(modalInstance.zIndex).toBe(104);
    });

    it('should properly handle a custom starting z-index', () => {
        modalManagerService.startingZIndex = 2000;

        modalInstance.show();

        expect(modalInstance.visible).toBe(true);
        expect(modalInstance.zIndex).toBe(2000);
    });

    it('should close on overlay click when allowClose is true', () => {
        modalInstance.show();

        // Check that the window is visible
        expect(modalInstance.visible).toBe(true);

        // Click the overlay
        overlayDiv.dispatchEvent(new Event('click'));

        // Check that the window was properly closed
        expect(hideSpy).toHaveBeenCalledTimes(1);
        expect(modalInstance.visible).toBe(false);
    });

    it('should not close on overlay click when allowClose is false', () => {
        // Turn allowClose off before showing the window
        modalInstance.allowClose = false;
        modalInstance.show();

        // Check that the window is visible
        expect(modalInstance.visible).toBe(true);

        // Click the overlay
        overlayDiv.dispatchEvent(new Event('click'));

        // Ensure that the window has not been closed
        expect(hideSpy).not.toHaveBeenCalled();
        expect(modalInstance.visible).toBe(true);
    });
});


