import { Column } from "./column";
import { Constraint } from "./constraint";

export interface Table {
    name: string;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    columns: Column[];
    constraints: Constraint[];
}