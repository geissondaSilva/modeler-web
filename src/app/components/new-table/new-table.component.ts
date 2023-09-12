import { Component, ElementRef, Inject, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LineControlDirective } from 'src/app/directives/line-control.directive';
import { Table } from 'src/app/models/table';
import { TableRef } from 'src/app/models/table-ref';
import { DataService } from 'src/app/services/data.service';
import { DesignerService } from 'src/app/services/designer.service';
import { CONFIGURATION, Configuration } from 'src/app/tokens/configuration';

@Component({
    selector: 'app-new-table',
    templateUrl: './new-table.component.html',
    styleUrls: ['./new-table.component.scss']
})
export class NewTableComponent {

    public table: Table;

    @ViewChild('grid') public grid?: ElementRef<HTMLTableElement>;

    @ViewChildren(LineControlDirective) public lines: QueryList<LineControlDirective> | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { x?: number, y?: number, table?: Table, ref?: TableRef },
        public dialogRef: MatDialogRef<NewTableComponent>,
        @Inject(CONFIGURATION) private config: Configuration,
        private dataService: DataService,
        private designer: DesignerService,
    ) {
        this.table = data.table ? data.table : this.getNewTable();
    }

    private getNewTable() {
        return {
            name: 'new_table',
            color: 'blue',
            x: this.data.x,
            y: this.data.y,
            height: 100,
            width: 180,
            columns: [
                {
                    name: 'id',
                    pk: true,
                    type: 'bigint'
                }
            ],
            constraints: []
        } as Table;
    }

    public focus(row: number, col: number) {
        if (!this.lines) return;
        const line = this.lines.get(row);
        if (line) {
            line.focusCol(col);
        }
    }

    get maxLines() {
        return this.table.columns.length;
    }

    get maxCols() {
        return 3;
    }

    create() {
        const { colSize, headerHeight } = this.config;
        this.table.height = this.table.columns.length * colSize + headerHeight;
        this.dialogRef.close(this.table);
    }

    onEnter(index: number) {
        const newIndex = index + 1;
        this.table.columns.splice(newIndex, 0, {});
        let me = this;
        setTimeout(() => {
            me.focus(newIndex, 0);
        }, 300);
    }

    delete() {
        if (this.data.ref) {
            this.dataService.deleteTable(this.data.ref)
        }
        this.designer.refresh();        
        this.dialogRef.close();
    }

}
