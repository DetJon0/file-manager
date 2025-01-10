import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderFilterComponent } from './folder-filter.component';

describe('FolderFilterComponent', () => {
  let component: FolderFilterComponent;
  let fixture: ComponentFixture<FolderFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
