import { TestBed } from '@angular/core/testing';

import { MiddleTierService } from './middle-tier.service';

describe('MiddleTierService', () => {
  let service: MiddleTierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiddleTierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
