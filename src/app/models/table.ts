import { Column } from "./column";
import { Relations } from "./relation";

export interface Table {
    name: string;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    columns: Column[];
    relations: Relations[];
}