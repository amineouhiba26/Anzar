import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAgency } from '../agency.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../agency.test-samples';

import { AgencyService, RestAgency } from './agency.service';

const requireRestSample: RestAgency = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Agency Service', () => {
  let service: AgencyService;
  let httpMock: HttpTestingController;
  let expectedResult: IAgency | IAgency[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AgencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Agency', () => {
      const agency = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(agency).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Agency', () => {
      const agency = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(agency).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Agency', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Agency', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Agency', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAgencyToCollectionIfMissing', () => {
      it('should add a Agency to an empty array', () => {
        const agency: IAgency = sampleWithRequiredData;
        expectedResult = service.addAgencyToCollectionIfMissing([], agency);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(agency);
      });

      it('should not add a Agency to an array that contains it', () => {
        const agency: IAgency = sampleWithRequiredData;
        const agencyCollection: IAgency[] = [
          {
            ...agency,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAgencyToCollectionIfMissing(agencyCollection, agency);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Agency to an array that doesn't contain it", () => {
        const agency: IAgency = sampleWithRequiredData;
        const agencyCollection: IAgency[] = [sampleWithPartialData];
        expectedResult = service.addAgencyToCollectionIfMissing(agencyCollection, agency);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(agency);
      });

      it('should add only unique Agency to an array', () => {
        const agencyArray: IAgency[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const agencyCollection: IAgency[] = [sampleWithRequiredData];
        expectedResult = service.addAgencyToCollectionIfMissing(agencyCollection, ...agencyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const agency: IAgency = sampleWithRequiredData;
        const agency2: IAgency = sampleWithPartialData;
        expectedResult = service.addAgencyToCollectionIfMissing([], agency, agency2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(agency);
        expect(expectedResult).toContain(agency2);
      });

      it('should accept null and undefined values', () => {
        const agency: IAgency = sampleWithRequiredData;
        expectedResult = service.addAgencyToCollectionIfMissing([], null, agency, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(agency);
      });

      it('should return initial array if no Agency is added', () => {
        const agencyCollection: IAgency[] = [sampleWithRequiredData];
        expectedResult = service.addAgencyToCollectionIfMissing(agencyCollection, undefined, null);
        expect(expectedResult).toEqual(agencyCollection);
      });
    });

    describe('compareAgency', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAgency(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 8238 };
        const entity2 = null;

        const compareResult1 = service.compareAgency(entity1, entity2);
        const compareResult2 = service.compareAgency(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 8238 };
        const entity2 = { id: 23199 };

        const compareResult1 = service.compareAgency(entity1, entity2);
        const compareResult2 = service.compareAgency(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 8238 };
        const entity2 = { id: 8238 };

        const compareResult1 = service.compareAgency(entity1, entity2);
        const compareResult2 = service.compareAgency(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
