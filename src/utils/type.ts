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
}

export type MethourDTO = {
  date: string;
  hora: string;
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

export interface MoomDTO {
  date: string;
  name?: string;
  icon?: string;
}

export interface TodayDTO {
  indi: string;
  desc?: string;
  valu?: string;
  info?: string;  
  pluz?: string;
  nsun?: string;
  mday?: string;
  psun?: string;
  uluz?: string;
}

export interface JobDTO {
    name: string;
    amount?: string;
    details?: string;
    cidadeId?: number;
}