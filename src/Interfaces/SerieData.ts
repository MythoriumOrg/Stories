import {Volume} from "./Volume.ts";

export interface SerieData {
    name: string;
    images: string;
    volumes: Volume[];
}