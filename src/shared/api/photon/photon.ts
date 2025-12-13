export interface PhotonFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    osm_id: number;
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface PhotonResponse {
  features: PhotonFeature[];
}
