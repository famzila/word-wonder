export interface Timepoint {
  markName: string;
  timeSeconds: number;
}

export interface TtsResponse {
  audioContent: string;
  timepoints?: Timepoint[];
  audioConfig?: {
    audioEncoding: string;
    speakingRate: number;
    pitch: number;
    volumeGainDb: number;
    sampleRateHertz: number;
    effectsProfileId: string[];
  };
}
