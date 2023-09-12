import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Diagrama } from '../models/diagrama';
import { Options } from '../models/options';
import { Table } from '../models/table';
import { TableRef } from '../models/table-ref';
import { Relations } from '../models/relation';
import { Point } from '../models/point';
import { RelationalMap } from '../models/relational-map';
import { RelationalDesign } from '../models/relational-design';
import { Constraint } from '../models/constraint';
import { Column } from '../models/column';
import { CONFIGURATION, Configuration } from '../tokens/configuration';

@Injectable({ providedIn: 'root' })
export class DataService {

    private readonly ID = 'diagram';

    private _diagram: Diagrama;

    private _options: Options;

    constructor(
        @Inject(CONFIGURATION) private config: Configuration,
    ) {
        this._options = {
            relational: false,
        }
        this._diagram = {
            schemas: [],
        };
    }

    get options() {
        return this._options;
    }

    public get(): Observable<Diagrama> {
        const data = localStorage.getItem(this.ID);
        if (data) {
            this._diagram = JSON.parse(data);
        } else {
            this._diagram = {
                schemas: [
                    { name: 'public', tables: [] }
                ],
            };
        }
        return of(this._diagram);
    }

    get diagram() {
        return this._diagram;
    }

    addTable(table: Table) {
        this.diagram?.schemas?.at(0)?.tables?.push(table);
    }

    editTable(table: Table, ref: TableRef) {
        this._diagram.schemas[ref.schema].tables[ref.position] = table;
    }

    public setRelationDesign(relation?: Relations) {
        this._options.relation = relation;
    }

    public deleteTable(ref: TableRef) {
        this._diagram.schemas[ref.schema].tables.splice(ref.position, 1);
    }

    save() {
        localStorage.setItem(this.ID, JSON.stringify(this.diagram));
    }

    public getTable(ref: TableRef) {
        return this.diagram.schemas[ref.schema].tables[ref.position];
    }

    public getSchema(position: number) {
        return this.diagram.schemas[position];
    }

    addConstraint(constraint: Constraint, ref: TableRef) {
        const table = this.getTable(ref);
        table.constraints.push(constraint);
        table.columns.push({
            name: constraint.column,
            type: 'bigint',
        } as Column);
        const { colSize, headerHeight } = this.config;
        table.height = table.columns.length * colSize + headerHeight;
    }
}