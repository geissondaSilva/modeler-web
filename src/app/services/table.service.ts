import { Injectable, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewTableComponent } from '../components/new-table/new-table.component';
import { DesignerService } from './designer.service';
import { DataService } from './data.service';
import { CONFIGURATION, Configuration } from '../tokens/configuration';
import { TableRef } from '../models/table-ref';
import { Table } from '../models/table';

@Injectable({
    providedIn: 'root'
})
export class TableService {

    private tableRef = { schema: -1, position: -1 };

    public newTableFn: any;
    public downTableFn: any;
    public moveTableFn: any;
    public upTableFn: any;
    public editTableFn: any;

    constructor(
        public dialog: MatDialog,
        private designer: DesignerService,
        private data: DataService,
        @Inject(CONFIGURATION) private config: Configuration
    ) {
        this.newTableFn = this.onNewTable.bind(this);
        this.downTableFn = this.onTableDown.bind(this);
        this.upTableFn = this.onTableUp.bind(this);
        this.moveTableFn = this.onTableMove.bind(this);
        this.editTableFn = this.editTable.bind(this);
    }

    public newTable() {
        window.addEventListener('mousedown', this.newTableFn);
    }

    private onNewTable(event: MouseEvent) {
        this.createTable(event.x, event.y);
        window.removeEventListener('mousedown', this.newTableFn);
    }

    private createTable(x: number, y: number) {
        const dialogRef = this.dialog.open(NewTableComponent, { data: { x: x, y: y }, height: '600px', width: '900px' });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.data.addTable(result);
                this.designer.design(this.data.diagram, this.data.options);
            }
        });
    }

    showTable(ref: TableRef) {
        const editTable = Object.assign({}, this.data.diagram.schemas[ref.schema].tables[ref.position]);
        const dialogRef = this.dialog.open(NewTableComponent, { data: { table: editTable, ref }, height: '600px', width: '900px' });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.data.editTable(result, ref);
                this.designer.design(this.data.diagram, this.data.options);
            }
        });
    }

    public moveTable() {
        window.addEventListener('mousedown', this.downTableFn);
    }

    private onTableDown(event: MouseEvent) {
        const { navHeight } = this.config;
        const ref = this.designer.getTableRefFromPosition(event.x, event.y - navHeight);
        if (ref.schema == -1) return;
        this.tableRef = Object.assign({}, ref);
        window.addEventListener('mousemove', this.moveTableFn);
        window.addEventListener('mouseup', this.upTableFn);
    }

    private onTableUp(event: MouseEvent) {
        window.removeEventListener('mousemove', this.moveTableFn);
    }

    private onTableMove(event: MouseEvent) {
        const { schemas } = this.data.diagram;
        const { navHeight } = this.config;
        const table = schemas[this.tableRef.schema].tables[this.tableRef.position];
        table.x = this.toZero(event.x);
        table.y = this.toZero(event.y - navHeight);
        this.designer.design(this.data.diagram, this.data.options);
    }

    private toZero(value: number) {
        return value > 0 ? value : 0;
    }

    private editTable(event: MouseEvent) {
        const { navHeight } = this.config;
        const ref = this.designer.getTableRefFromPosition(event.x, event.y - navHeight);
        if (ref.position !== -1) {
            this.showTable(ref);
        } else {
            this.createTable(event.x, event.y);
        }
    }
}
