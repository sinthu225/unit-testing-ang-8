import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { Directive, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { DataStoreService } from '../services/data-store.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {

    @Directive({ selector: '[appShowAuthed]' })
    class AppShowAuthedMock implements OnInit {
      @Input() appShowAuthed
      constructor(
        private dataStoreService: DataStoreService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
      ) { }

      ngOnInit() {
        this.dataStoreService.isAuthenticated.subscribe((isAuthenticated) => {
          if (
            (isAuthenticated && this.appShowAuthed) ||
            (!isAuthenticated && !this.appShowAuthed)
          ) {

            this.viewContainer.createEmbeddedView(this.templateRef);
          }
          else {
            this.viewContainer.clear();
          }
        })

      }

    }

    TestBed.configureTestingModule({
      declarations: [ HomeComponent, AppShowAuthedMock ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show Login for not logged in user', async () => {
    await fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#login-button'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#logout-button'))).toBeNull();
  });

  it('should show Logout button and hide Login Button for not logged in user', async () => {
    const datastore = TestBed.get(DataStoreService);
    datastore.isAuthenticated = of(true);
    // TestBed.overrideProvider(DataStoreService,datastore)
    // fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(fixture.debugElement.query(By.css('#logout-button'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#login-button'))).toBeNull();
  });
});
