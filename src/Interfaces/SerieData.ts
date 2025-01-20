import {Volume} from "./Volume.ts";

export interface SerieData {
    name: string;
    url: string;
    volumes: Volume[];
}