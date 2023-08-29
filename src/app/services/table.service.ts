import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewTableComponent } from '../components/new-table/new-table.component';
import { DesignerService } from './designer.service';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class TableService {

    public newTableFn: any;

    constructor(
        public dialog: MatDialog,
        private designer: DesignerService,
        private data: DataService,
    ) {
        this.newTableFn = this.onNewTable.bind(this);
    }

    public newTable() {
        window.addEventListener('mousedown', this.newTableFn);
    }

    private onNewTable(event: MouseEvent) {
        this.createTable(event.x, event.y);
        window.removeEventListener('mousedown', this.newTableFn);
    }

    private createTable(x: number, y: number) {
        const dialogRef = this.dialog.open(NewTableComponent, { data: { x: x, y: y }, height: '600px', width: '900px'});
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.data.addTable(result);
                this.designer.design(this.data.diagram, this.data.options);
            }
        });
    }
}
