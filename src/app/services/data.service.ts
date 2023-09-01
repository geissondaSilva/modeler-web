import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Diagrama } from '../models/diagrama';
import { Options } from '../models/options';
import { Table } from '../models/table';

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

    private _diagram: Diagrama;

    private _options: Options;

    constructor() {
        this._options = {
            relational: false,
        }
        this._diagram = {
            schemas: []
        };
    }

    get options() {
        return this._options;
    }

    public get(): Observable<Diagrama> {
        this._diagram = DATA;
        return of(this._diagram);
    }

    get diagram() {
        return this._diagram;
    }

    addTable(table: Table) {
        this.diagram?.schemas?.at(0)?.tables?.push(table);
    }
}