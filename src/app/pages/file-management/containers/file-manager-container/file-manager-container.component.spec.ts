import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerContainerComponent } from './file-manager-container.component';

describe('FileManagerContainerComponent', () => {
  let component: FileManagerContainerComponent;
  let fixture: ComponentFixture<FileManagerContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileManagerContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileManagerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
