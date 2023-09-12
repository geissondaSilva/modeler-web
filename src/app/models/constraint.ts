export interface Constraint {
    type: 'pk' | 'fk';
    name: string;
    column: string;
    referenceTable: string;
    referenceColumn: string;
}