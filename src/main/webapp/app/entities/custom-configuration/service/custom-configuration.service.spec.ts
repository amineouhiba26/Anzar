import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ICustomConfiguration } from '../custom-configuration.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../custom-configuration.test-samples';

import { CustomConfigurationService, RestCustomConfiguration } from './custom-configuration.service';

const requireRestSample: RestCustomConfiguration = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('CustomConfiguration Service', () => {
  let service: CustomConfigurationService;
  let httpMock: HttpTestingController;
  let expectedResult: ICustomConfiguration | ICustomConfiguration[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CustomConfigurationService);
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

    it('should create a CustomConfiguration', () => {
      const customConfiguration = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(customConfiguration).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CustomConfiguration', () => {
      const customConfiguration = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(customConfiguration).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CustomConfiguration', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CustomConfiguration', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CustomConfiguration', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCustomConfigurationToCollectionIfMissing', () => {
      it('should add a CustomConfiguration to an empty array', () => {
        const customConfiguration: ICustomConfiguration = sampleWithRequiredData;
        expectedResult = service.addCustomConfigurationToCollectionIfMissing([], customConfiguration);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customConfiguration);
      });

      it('should not add a CustomConfiguration to an array that contains it', () => {
        const customConfiguration: ICustomConfiguration = sampleWithRequiredData;
        const customConfigurationCollection: ICustomConfiguration[] = [
          {
            ...customConfiguration,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCustomConfigurationToCollectionIfMissing(customConfigurationCollection, customConfiguration);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CustomConfiguration to an array that doesn't contain it", () => {
        const customConfiguration: ICustomConfiguration = sampleWithRequiredData;
        const customConfigurationCollection: ICustomConfiguration[] = [sampleWithPartialData];
        expectedResult = service.addCustomConfigurationToCollectionIfMissing(customConfigurationCollection, customConfiguration);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customConfiguration);
      });

      it('should add only unique CustomConfiguration to an array', () => {
        const customConfigurationArray: ICustomConfiguration[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const customConfigurationCollection: ICustomConfiguration[] = [sampleWithRequiredData];
        expectedResult = service.addCustomConfigurationToCollectionIfMissing(customConfigurationCollection, ...customConfigurationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const customConfiguration: ICustomConfiguration = sampleWithRequiredData;
        const customConfiguration2: ICustomConfiguration = sampleWithPartialData;
        expectedResult = service.addCustomConfigurationToCollectionIfMissing([], customConfiguration, customConfiguration2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customConfiguration);
        expect(expectedResult).toContain(customConfiguration2);
      });

      it('should accept null and undefined values', () => {
        const customConfiguration: ICustomConfiguration = sampleWithRequiredData;
        expectedResult = service.addCustomConfigurationToCollectionIfMissing([], null, customConfiguration, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customConfiguration);
      });

      it('should return initial array if no CustomConfiguration is added', () => {
        const customConfigurationCollection: ICustomConfiguration[] = [sampleWithRequiredData];
        expectedResult = service.addCustomConfigurationToCollectionIfMissing(customConfigurationCollection, undefined, null);
        expect(expectedResult).toEqual(customConfigurationCollection);
      });
    });

    describe('compareCustomConfiguration', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCustomConfiguration(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 23696 };
        const entity2 = null;

        const compareResult1 = service.compareCustomConfiguration(entity1, entity2);
        const compareResult2 = service.compareCustomConfiguration(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 23696 };
        const entity2 = { id: 31396 };

        const compareResult1 = service.compareCustomConfiguration(entity1, entity2);
        const compareResult2 = service.compareCustomConfiguration(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 23696 };
        const entity2 = { id: 23696 };

        const compareResult1 = service.compareCustomConfiguration(entity1, entity2);
        const compareResult2 = service.compareCustomConfiguration(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
