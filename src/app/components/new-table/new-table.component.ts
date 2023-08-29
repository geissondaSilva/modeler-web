import { Component, ElementRef, Inject, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LineControlDirective } from 'src/app/directives/line-control.directive';
import { Table } from 'src/app/models/table';

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
        @Inject(MAT_DIALOG_DATA) public data: { x: number, y: number },
        public dialogRef: MatDialogRef<NewTableComponent>,
    ) {
        this.table = {
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
            ]
        };
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

}
