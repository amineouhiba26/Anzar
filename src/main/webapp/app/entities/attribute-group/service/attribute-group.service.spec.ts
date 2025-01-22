import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAttributeGroup } from '../attribute-group.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../attribute-group.test-samples';

import { AttributeGroupService, RestAttributeGroup } from './attribute-group.service';

const requireRestSample: RestAttributeGroup = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('AttributeGroup Service', () => {
  let service: AttributeGroupService;
  let httpMock: HttpTestingController;
  let expectedResult: IAttributeGroup | IAttributeGroup[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AttributeGroupService);
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

    it('should create a AttributeGroup', () => {
      const attributeGroup = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(attributeGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AttributeGroup', () => {
      const attributeGroup = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(attributeGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AttributeGroup', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AttributeGroup', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AttributeGroup', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAttributeGroupToCollectionIfMissing', () => {
      it('should add a AttributeGroup to an empty array', () => {
        const attributeGroup: IAttributeGroup = sampleWithRequiredData;
        expectedResult = service.addAttributeGroupToCollectionIfMissing([], attributeGroup);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attributeGroup);
      });

      it('should not add a AttributeGroup to an array that contains it', () => {
        const attributeGroup: IAttributeGroup = sampleWithRequiredData;
        const attributeGroupCollection: IAttributeGroup[] = [
          {
            ...attributeGroup,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAttributeGroupToCollectionIfMissing(attributeGroupCollection, attributeGroup);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AttributeGroup to an array that doesn't contain it", () => {
        const attributeGroup: IAttributeGroup = sampleWithRequiredData;
        const attributeGroupCollection: IAttributeGroup[] = [sampleWithPartialData];
        expectedResult = service.addAttributeGroupToCollectionIfMissing(attributeGroupCollection, attributeGroup);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attributeGroup);
      });

      it('should add only unique AttributeGroup to an array', () => {
        const attributeGroupArray: IAttributeGroup[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const attributeGroupCollection: IAttributeGroup[] = [sampleWithRequiredData];
        expectedResult = service.addAttributeGroupToCollectionIfMissing(attributeGroupCollection, ...attributeGroupArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const attributeGroup: IAttributeGroup = sampleWithRequiredData;
        const attributeGroup2: IAttributeGroup = sampleWithPartialData;
        expectedResult = service.addAttributeGroupToCollectionIfMissing([], attributeGroup, attributeGroup2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attributeGroup);
        expect(expectedResult).toContain(attributeGroup2);
      });

      it('should accept null and undefined values', () => {
        const attributeGroup: IAttributeGroup = sampleWithRequiredData;
        expectedResult = service.addAttributeGroupToCollectionIfMissing([], null, attributeGroup, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attributeGroup);
      });

      it('should return initial array if no AttributeGroup is added', () => {
        const attributeGroupCollection: IAttributeGroup[] = [sampleWithRequiredData];
        expectedResult = service.addAttributeGroupToCollectionIfMissing(attributeGroupCollection, undefined, null);
        expect(expectedResult).toEqual(attributeGroupCollection);
      });
    });

    describe('compareAttributeGroup', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAttributeGroup(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 17745 };
        const entity2 = null;

        const compareResult1 = service.compareAttributeGroup(entity1, entity2);
        const compareResult2 = service.compareAttributeGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 17745 };
        const entity2 = { id: 7653 };

        const compareResult1 = service.compareAttributeGroup(entity1, entity2);
        const compareResult2 = service.compareAttributeGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 17745 };
        const entity2 = { id: 17745 };

        const compareResult1 = service.compareAttributeGroup(entity1, entity2);
        const compareResult2 = service.compareAttributeGroup(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
