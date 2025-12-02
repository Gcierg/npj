export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface Ad {
  id: number;
  imageUrl?: string; // Optional image
  title?: string;    // Optional title text
  text?: string;     // Optional body text
  linkUrl: string;   // Required link
  buttonText?: string; // Optional button text
  country?: string;  // Optional 2-letter country code (e.g., 'US', 'ES')
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets: {
        uri: string;
        title: string;
      }[];
    }[];
  };
}