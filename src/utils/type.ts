export interface MeteoredDTO {
  date: string;
  name?: string;
  icon?: string;
  desc?: string;
  temp?: string;
  sens?: string;
  tmax?: string;
  tmin?: string;
  wind?: string;
  burs?: string;
  rain?: string;
  prov?: string;
  cidadeId?: number;
}

export type NexthourDTO = {
  date:  string;
  hour:  string;
  temp?: string;
  sens?: string;
  rain?: string;
  prov?: string;
  clod?: string;
  fogs?: string;
  visb?: string;
  dews?: string;
  umid?: string;
  desc?: string;
  wind?: string;
  burs?: string;
  pres?: string;
  ifps?: string;
  icon?: string;
  cidadeId?: number;
};

export interface LunarDTO {
  day:   string;
  name?: string;
  icon?: string;
  perc?: string;
}

export interface TodayDTO {
  date: string;
  indi: string;
  desc?: string;
  valu?: string;
  info?: string; 
  resu?: string;   
  pluz?: string;
  nsun?: string;
  mday?: string;
  psun?: string;
  uluz?: string;
  cidadeId?: number;
}

export interface EmpregoDTO {
    name: string;
    amount?: string;
    details?: string;
    cidadeId?: number;
}

export interface PrefeituraDTO {
  uri: string;
  title: string;
  descricao: string;
  thumbnail: string;
  cidadeId?: number;
}

export interface GroqResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}