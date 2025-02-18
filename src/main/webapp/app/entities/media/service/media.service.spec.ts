import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IMedia } from '../media.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../media.test-samples';

import { MediaService, RestMedia } from './media.service';

const requireRestSample: RestMedia = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Media Service', () => {
  let service: MediaService;
  let httpMock: HttpTestingController;
  let expectedResult: IMedia | IMedia[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(MediaService);
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

    it('should create a Media', () => {
      const media = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(media).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Media', () => {
      const media = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(media).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Media', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Media', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Media', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMediaToCollectionIfMissing', () => {
      it('should add a Media to an empty array', () => {
        const media: IMedia = sampleWithRequiredData;
        expectedResult = service.addMediaToCollectionIfMissing([], media);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(media);
      });

      it('should not add a Media to an array that contains it', () => {
        const media: IMedia = sampleWithRequiredData;
        const mediaCollection: IMedia[] = [
          {
            ...media,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMediaToCollectionIfMissing(mediaCollection, media);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Media to an array that doesn't contain it", () => {
        const media: IMedia = sampleWithRequiredData;
        const mediaCollection: IMedia[] = [sampleWithPartialData];
        expectedResult = service.addMediaToCollectionIfMissing(mediaCollection, media);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(media);
      });

      it('should add only unique Media to an array', () => {
        const mediaArray: IMedia[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mediaCollection: IMedia[] = [sampleWithRequiredData];
        expectedResult = service.addMediaToCollectionIfMissing(mediaCollection, ...mediaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const media: IMedia = sampleWithRequiredData;
        const media2: IMedia = sampleWithPartialData;
        expectedResult = service.addMediaToCollectionIfMissing([], media, media2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(media);
        expect(expectedResult).toContain(media2);
      });

      it('should accept null and undefined values', () => {
        const media: IMedia = sampleWithRequiredData;
        expectedResult = service.addMediaToCollectionIfMissing([], null, media, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(media);
      });

      it('should return initial array if no Media is added', () => {
        const mediaCollection: IMedia[] = [sampleWithRequiredData];
        expectedResult = service.addMediaToCollectionIfMissing(mediaCollection, undefined, null);
        expect(expectedResult).toEqual(mediaCollection);
      });
    });

    describe('compareMedia', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMedia(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 179 };
        const entity2 = null;

        const compareResult1 = service.compareMedia(entity1, entity2);
        const compareResult2 = service.compareMedia(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 179 };
        const entity2 = { id: 26043 };

        const compareResult1 = service.compareMedia(entity1, entity2);
        const compareResult2 = service.compareMedia(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 179 };
        const entity2 = { id: 179 };

        const compareResult1 = service.compareMedia(entity1, entity2);
        const compareResult2 = service.compareMedia(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
