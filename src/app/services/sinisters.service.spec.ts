import { TestBed } from '@angular/core/testing';

import { SinistersService } from './sinisters.service';

describe('SinistersService', () => {
  let service: SinistersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SinistersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
