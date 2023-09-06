import { Point } from "./point";
import { Relations } from "./relation";

export interface Options {
    relational: boolean;
    points: Point[];
    relation?: Relations;
}