import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAttribute } from '../attribute.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../attribute.test-samples';

import { AttributeService, RestAttribute } from './attribute.service';

const requireRestSample: RestAttribute = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Attribute Service', () => {
  let service: AttributeService;
  let httpMock: HttpTestingController;
  let expectedResult: IAttribute | IAttribute[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AttributeService);
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

    it('should create a Attribute', () => {
      const attribute = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(attribute).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Attribute', () => {
      const attribute = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(attribute).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Attribute', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Attribute', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Attribute', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAttributeToCollectionIfMissing', () => {
      it('should add a Attribute to an empty array', () => {
        const attribute: IAttribute = sampleWithRequiredData;
        expectedResult = service.addAttributeToCollectionIfMissing([], attribute);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attribute);
      });

      it('should not add a Attribute to an array that contains it', () => {
        const attribute: IAttribute = sampleWithRequiredData;
        const attributeCollection: IAttribute[] = [
          {
            ...attribute,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, attribute);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Attribute to an array that doesn't contain it", () => {
        const attribute: IAttribute = sampleWithRequiredData;
        const attributeCollection: IAttribute[] = [sampleWithPartialData];
        expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, attribute);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attribute);
      });

      it('should add only unique Attribute to an array', () => {
        const attributeArray: IAttribute[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const attributeCollection: IAttribute[] = [sampleWithRequiredData];
        expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, ...attributeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const attribute: IAttribute = sampleWithRequiredData;
        const attribute2: IAttribute = sampleWithPartialData;
        expectedResult = service.addAttributeToCollectionIfMissing([], attribute, attribute2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attribute);
        expect(expectedResult).toContain(attribute2);
      });

      it('should accept null and undefined values', () => {
        const attribute: IAttribute = sampleWithRequiredData;
        expectedResult = service.addAttributeToCollectionIfMissing([], null, attribute, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attribute);
      });

      it('should return initial array if no Attribute is added', () => {
        const attributeCollection: IAttribute[] = [sampleWithRequiredData];
        expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, undefined, null);
        expect(expectedResult).toEqual(attributeCollection);
      });
    });

    describe('compareAttribute', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAttribute(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 20409 };
        const entity2 = null;

        const compareResult1 = service.compareAttribute(entity1, entity2);
        const compareResult2 = service.compareAttribute(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 20409 };
        const entity2 = { id: 13715 };

        const compareResult1 = service.compareAttribute(entity1, entity2);
        const compareResult2 = service.compareAttribute(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 20409 };
        const entity2 = { id: 20409 };

        const compareResult1 = service.compareAttribute(entity1, entity2);
        const compareResult2 = service.compareAttribute(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
