import { TestBed } from '@angular/core/testing';

import { FolderUtilsService } from './folder-utils.service';

describe('FolderUtilsService', () => {
  let service: FolderUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FolderUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
