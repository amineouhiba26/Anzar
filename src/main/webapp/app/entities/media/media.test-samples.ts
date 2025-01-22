import dayjs from 'dayjs/esm';

import { IMedia, NewMedia } from './media.model';

export const sampleWithRequiredData: IMedia = {
  id: 18219,
};

export const sampleWithPartialData: IMedia = {
  id: 24194,
  url: 'https://fantastic-suitcase.net/',
  category: 'bowling smoothly dark',
  order: 24837,
  createdDate: dayjs('2025-01-22T09:20'),
};

export const sampleWithFullData: IMedia = {
  id: 26400,
  url: 'https://innocent-digit.info/',
  caption: 'out',
  category: 'seemingly neglect',
  order: 30320,
  createdBy: 'minor',
  createdDate: dayjs('2025-01-22T10:32'),
  lastModifiedBy: 'geez',
  lastModifiedDate: dayjs('2025-01-22T02:13'),
};

export const sampleWithNewData: NewMedia = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
