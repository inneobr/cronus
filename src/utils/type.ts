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
  rain?: string;
  prov?: string;
}

export type MethourDTO = {
    hora: string;
    temp?: string;
    sens?: string;
    rain?: string;
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