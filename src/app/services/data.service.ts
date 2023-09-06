import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Diagrama } from '../models/diagrama';
import { Options } from '../models/options';
import { Table } from '../models/table';
import { TableRef } from '../models/table-ref';
import { Relations } from '../models/relation';
import { Point } from '../models/point';
import { RelationalMap } from '../models/relational-map';

const DATA = {
    "name": "Biblioteca",
    "schemas": [
        {
            "name": "public",
            "tables": [
                {
                    "name": "pessoa",
                    "color": "blue",
                    "x": 319,
                    "y": 267,
                    "height": 72,
                    "width": 180,
                    "columns": [
                        {
                            "name": "codigo",
                            "pk": true,
                            "type": "bigint"
                        },
                        {
                            "name": "nome",
                            "type": "varchar",
                            "precision": 100
                        }
                    ]
                },
                {
                    "name": "autor",
                    "color": "blue",
                    "x": 671,
                    "y": 171,
                    "height": 96,
                    "width": 180,
                    "columns": [
                        {
                            "name": "codigo",
                            "pk": true,
                            "type": "bigint"
                        },
                        {
                            "name": "nome",
                            "type": "varchar",
                            "precision": 100
                        },
                        {
                            "name": "situacao",
                            "type": "int2"
                        }
                    ]
                }
            ]
        }
    ]
} as Diagrama;

@Injectable({providedIn: 'root'})
export class DataService {

    private readonly ID = 'diagram';

    private _diagram: Diagrama;

    private _options: Options;

    constructor() {
        this._options = {
            relational: false,
            points: []
        }
        this._diagram = {
            schemas: [],
        };
    }

    get options() {
        return this._options;
    }

    public updatePonints(points: Point[]) {
        this._options.points = points;
    }

    public get(): Observable<Diagrama> {
        const data = localStorage.getItem(this.ID);
        if (data) {
            this._diagram = JSON.parse(data);
        } else {
            this._diagram = DATA;
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

    addRelation(value: Relations, ref: RelationalMap) {
        const table = this._diagram.schemas[ref.schema].tables[ref.position];
        if (!table.relations) {
            table.relations = [];
        }
        table.relations.push(value);
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
}