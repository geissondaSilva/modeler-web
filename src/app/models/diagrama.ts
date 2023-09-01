import { Schema } from "./schema";

export interface Diagrama {
    name?: string;
    description?: string;
    schemas: Schema[];
}