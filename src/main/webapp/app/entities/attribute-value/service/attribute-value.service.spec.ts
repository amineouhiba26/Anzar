import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAttributeValue } from '../attribute-value.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../attribute-value.test-samples';

import { AttributeValueService, RestAttributeValue } from './attribute-value.service';

const requireRestSample: RestAttributeValue = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('AttributeValue Service', () => {
  let service: AttributeValueService;
  let httpMock: HttpTestingController;
  let expectedResult: IAttributeValue | IAttributeValue[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AttributeValueService);
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

    it('should create a AttributeValue', () => {
      const attributeValue = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(attributeValue).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AttributeValue', () => {
      const attributeValue = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(attributeValue).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AttributeValue', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AttributeValue', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AttributeValue', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAttributeValueToCollectionIfMissing', () => {
      it('should add a AttributeValue to an empty array', () => {
        const attributeValue: IAttributeValue = sampleWithRequiredData;
        expectedResult = service.addAttributeValueToCollectionIfMissing([], attributeValue);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attributeValue);
      });

      it('should not add a AttributeValue to an array that contains it', () => {
        const attributeValue: IAttributeValue = sampleWithRequiredData;
        const attributeValueCollection: IAttributeValue[] = [
          {
            ...attributeValue,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAttributeValueToCollectionIfMissing(attributeValueCollection, attributeValue);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AttributeValue to an array that doesn't contain it", () => {
        const attributeValue: IAttributeValue = sampleWithRequiredData;
        const attributeValueCollection: IAttributeValue[] = [sampleWithPartialData];
        expectedResult = service.addAttributeValueToCollectionIfMissing(attributeValueCollection, attributeValue);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attributeValue);
      });

      it('should add only unique AttributeValue to an array', () => {
        const attributeValueArray: IAttributeValue[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const attributeValueCollection: IAttributeValue[] = [sampleWithRequiredData];
        expectedResult = service.addAttributeValueToCollectionIfMissing(attributeValueCollection, ...attributeValueArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const attributeValue: IAttributeValue = sampleWithRequiredData;
        const attributeValue2: IAttributeValue = sampleWithPartialData;
        expectedResult = service.addAttributeValueToCollectionIfMissing([], attributeValue, attributeValue2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attributeValue);
        expect(expectedResult).toContain(attributeValue2);
      });

      it('should accept null and undefined values', () => {
        const attributeValue: IAttributeValue = sampleWithRequiredData;
        expectedResult = service.addAttributeValueToCollectionIfMissing([], null, attributeValue, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attributeValue);
      });

      it('should return initial array if no AttributeValue is added', () => {
        const attributeValueCollection: IAttributeValue[] = [sampleWithRequiredData];
        expectedResult = service.addAttributeValueToCollectionIfMissing(attributeValueCollection, undefined, null);
        expect(expectedResult).toEqual(attributeValueCollection);
      });
    });

    describe('compareAttributeValue', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAttributeValue(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 32470 };
        const entity2 = null;

        const compareResult1 = service.compareAttributeValue(entity1, entity2);
        const compareResult2 = service.compareAttributeValue(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 32470 };
        const entity2 = { id: 2753 };

        const compareResult1 = service.compareAttributeValue(entity1, entity2);
        const compareResult2 = service.compareAttributeValue(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 32470 };
        const entity2 = { id: 32470 };

        const compareResult1 = service.compareAttributeValue(entity1, entity2);
        const compareResult2 = service.compareAttributeValue(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
