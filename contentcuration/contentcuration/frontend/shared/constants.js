export const ContentDefaults = {
  author: 'author',
  provider: 'provider',
  aggregator: 'aggregator',
  copyright_holder: 'copyrightHolder',
  license: 'license',
  license_description: 'licenseDescription',
  auto_derive_audio_thumbnail: 'autoDeriveAudioThumbnail',
  auto_derive_document_thumbnail: 'autoDeriveDocumentThumbnail',
  auto_derive_html5_thumbnail: 'autoDeriveHtml5Thumbnail',
  auto_derive_video_thumbnail: 'autoDeriveVideoThumbnail',
};

export const ContentDefaultsDefaults = {
  author: '',
  provider: '',
  aggregator: '',
  copyright_holder: '',
  license: '',
  license_description: '',
  auto_derive_audio_thumbnail: true,
  auto_derive_document_thumbnail: true,
  auto_derive_html5_thumbnail: true,
  auto_derive_video_thumbnail: true,
};

// This symbol is used in cases where we want to set a default value
// for a symbol but have it be identifiable as a fill in.
export const NOVALUE = Symbol('No value default');

// This symbol is used as a key on objects that are new to indicate
// that they have not yet been committed to our IndexedDB layer.
export const NEW_OBJECT = Symbol('New object');

export const kindToIconMap = {
  audio: 'headset',
  channel: 'apps',
  document: 'description',
  exercise: 'star',
  html5: 'widgets',
  image: 'image',
  slideshow: 'photo_library',
  topic: 'folder',
  video: 'theaters',
};

export const SharingPermissions = {
  EDIT: 'edit',
  VIEW_ONLY: 'view',
};

// File constants
export const fileErrors = {
  NO_STORAGE: 'NO_STORAGE',
  WRONG_TYPE: 'WRONG_TYPE',
  TOO_LARGE: 'TOO_LARGE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  URL_EXPIRED: 'URL_EXPIRED',
  CHECKSUM_HASH_FAILED: 'CHECKSUM_HASH_FAILED',
};

export const MAX_FILE_SIZE = 209715200;

export const ASPECT_RATIO = 16 / 9;

export const ONE_B = 1;
export const ONE_KB = 10 ** 3;
export const ONE_MB = 10 ** 6;
export const ONE_GB = 10 ** 9;
export const ONE_TB = 10 ** 12;

export const policies = {
  PRIVACY: 'privacy_policy',
};
export const policyDates = {
  [policies.PRIVACY]: new Date(2018, 4, 25),
};

// Filter constants
export const filterTypes = {
  BOOLEAN: 'BOOLEAN',
  MULTISELECT: 'MULTISELECT',
  TEXT: 'TEXT',
  DATE: 'DATE',
};

export const ChannelListTypes = {
  // These field names are set in the ChannelSlimViewset
  PUBLIC: 'public',
  EDITABLE: 'edit',
  STARRED: 'bookmark',
  VIEW_ONLY: 'view',
};
