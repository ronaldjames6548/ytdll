export interface Root {
  formats: Format[];
  videoDetails: VideoDetails;
}

export interface Format {
  mimeType: string;
  qualityLabel?: string;
  bitrate: number;
  audioBitrate?: number;
  itag: number;
  url: string;
  width?: number;
  height?: number;
  lastModified: string;
  contentLength?: string;
  quality: string;
  fps?: number;
  projectionType: string;
  averageBitrate?: number;
  audioQuality?: string;
  approxDurationMs: string;
  audioSampleRate?: string;
  audioChannels?: number;
  hasVideo: boolean;
  hasAudio: boolean;
  container: string;
  codecs: string;
  videoCodec?: string;
  audioCodec?: string;
  isLive: boolean;
  isHLS: boolean;
  isDashMPD: boolean;
  initRange?: InitRange;
  indexRange?: IndexRange;
  colorInfo?: ColorInfo;
  highReplication?: boolean;
  loudnessDb?: number;
}

export interface InitRange {
  start: string;
  end: string;
}

export interface IndexRange {
  start: string;
  end: string;
}

export interface ColorInfo {
  primaries: string;
  transferCharacteristics: string;
  matrixCoefficients: string;
}

export interface VideoDetails {
  embed: Embed;
  title: string;
  description: string;
  lengthSeconds: string;
  ownerProfileUrl: string;
  externalChannelId: string;
  isFamilySafe: boolean;
  availableCountries: string[];
  isUnlisted: boolean;
  hasYpcMetadata: boolean;
  viewCount: string;
  category: string;
  publishDate: string;
  ownerChannelName: string;
  uploadDate: string;
  videoId: string;
  channelId: string;
  isOwnerViewing: boolean;
  isCrawlable: boolean;
  allowRatings: boolean;
  author: Author;
  isPrivate: boolean;
  isUnpluggedCorpus: boolean;
  isLiveContent: boolean;
  media: Media;
  likes: any;
  dislikes: any;
  age_restricted: boolean;
  video_url: string;
  storyboards: Storyboard[];
  chapters: Chapter[];
  thumbnails: Thumbnail2[];
}

export interface Embed {
  iframeUrl: string;
  width: number;
  height: number;
}

export interface Author {
  id: string;
  name: string;
  user: string;
  channel_url: string;
  external_channel_url: string;
  user_url: string;
  thumbnails: Thumbnail[];
  verified: boolean;
  subscriber_count: number;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Media {}

export interface Storyboard {
  templateUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  thumbnailCount: number;
  interval: number;
  columns: number;
  rows: number;
  storyboardCount: number;
}

export interface Chapter {
  title: string;
  start_time: number;
}

export interface Thumbnail2 {
  url: string;
  width: number;
  height: number;
}
