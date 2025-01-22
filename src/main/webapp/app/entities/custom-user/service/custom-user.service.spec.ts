import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ICustomUser } from '../custom-user.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../custom-user.test-samples';

import { CustomUserService, RestCustomUser } from './custom-user.service';

const requireRestSample: RestCustomUser = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('CustomUser Service', () => {
  let service: CustomUserService;
  let httpMock: HttpTestingController;
  let expectedResult: ICustomUser | ICustomUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CustomUserService);
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

    it('should create a CustomUser', () => {
      const customUser = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(customUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CustomUser', () => {
      const customUser = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(customUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CustomUser', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CustomUser', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CustomUser', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCustomUserToCollectionIfMissing', () => {
      it('should add a CustomUser to an empty array', () => {
        const customUser: ICustomUser = sampleWithRequiredData;
        expectedResult = service.addCustomUserToCollectionIfMissing([], customUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customUser);
      });

      it('should not add a CustomUser to an array that contains it', () => {
        const customUser: ICustomUser = sampleWithRequiredData;
        const customUserCollection: ICustomUser[] = [
          {
            ...customUser,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCustomUserToCollectionIfMissing(customUserCollection, customUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CustomUser to an array that doesn't contain it", () => {
        const customUser: ICustomUser = sampleWithRequiredData;
        const customUserCollection: ICustomUser[] = [sampleWithPartialData];
        expectedResult = service.addCustomUserToCollectionIfMissing(customUserCollection, customUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customUser);
      });

      it('should add only unique CustomUser to an array', () => {
        const customUserArray: ICustomUser[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const customUserCollection: ICustomUser[] = [sampleWithRequiredData];
        expectedResult = service.addCustomUserToCollectionIfMissing(customUserCollection, ...customUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const customUser: ICustomUser = sampleWithRequiredData;
        const customUser2: ICustomUser = sampleWithPartialData;
        expectedResult = service.addCustomUserToCollectionIfMissing([], customUser, customUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customUser);
        expect(expectedResult).toContain(customUser2);
      });

      it('should accept null and undefined values', () => {
        const customUser: ICustomUser = sampleWithRequiredData;
        expectedResult = service.addCustomUserToCollectionIfMissing([], null, customUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customUser);
      });

      it('should return initial array if no CustomUser is added', () => {
        const customUserCollection: ICustomUser[] = [sampleWithRequiredData];
        expectedResult = service.addCustomUserToCollectionIfMissing(customUserCollection, undefined, null);
        expect(expectedResult).toEqual(customUserCollection);
      });
    });

    describe('compareCustomUser', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCustomUser(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 11466 };
        const entity2 = null;

        const compareResult1 = service.compareCustomUser(entity1, entity2);
        const compareResult2 = service.compareCustomUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 11466 };
        const entity2 = { id: 17439 };

        const compareResult1 = service.compareCustomUser(entity1, entity2);
        const compareResult2 = service.compareCustomUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 11466 };
        const entity2 = { id: 11466 };

        const compareResult1 = service.compareCustomUser(entity1, entity2);
        const compareResult2 = service.compareCustomUser(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
