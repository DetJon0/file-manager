import { TestBed } from '@angular/core/testing';

import { FileManagerContainerStoreService } from './file-manager-container-store.service';

describe('FileManagerContainerStoreService', () => {
  let service: FileManagerContainerStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileManagerContainerStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
