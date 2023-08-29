import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Diagrama } from '../models/diagrama';
import { Options } from '../models/options';
import { Table } from '../models/table';

const DATA = {
    name: 'Biblioteca',
    schemas: [
        {
            name: 'public',
            tables: [
                {
                    name: 'autor',
                    color: 'green',
                    x: 10,
                    y: 20,
                    height: 300,
                    width: 180,
                    columns: [
                        {
                            name: 'id',
                            pk: true,
                            type: 'bigint'
                        },
                        {
                            name: 'nome',
                            pk: false,
                            type: 'varchar',
                            precision: 100
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
        this._diagram = {};
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