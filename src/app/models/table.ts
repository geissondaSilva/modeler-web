import { Column } from "./column";

export interface Table {
    name: string;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    columns: Column[];
}