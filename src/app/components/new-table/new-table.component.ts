import { Component, ElementRef, Inject, HostListener, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Table } from 'src/app/models/table';

enum KEY_CODE {
    RIGHT_ARROW = 'ArrowRight',
    LEFT_ARROW = 'ArrowLeft',
    UP_ARROW = 'ArrowUp',
    DOWN_ARROW = 'ArrowDown',
  }

@Component({
    selector: 'app-new-table',
    templateUrl: './new-table.component.html',
    styleUrls: ['./new-table.component.scss']
})
export class NewTableComponent {

    public table: Table;

    @ViewChild('grid') public grid?: ElementRef<HTMLTableElement>;

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

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        switch(event.key) {
            case KEY_CODE.DOWN_ARROW: this.focusNextLine(); break;
            case KEY_CODE.UP_ARROW: this.focusPreviosLine(); break;
        }
    }

    focusNextLine() {
        this.focusLine(2);
    }

    focusPreviosLine() {
        this.focusLine(0);
    }

    private focusLine(next: number) {
        const isInputCols = document.activeElement?.classList.contains('input-table');
        if (!isInputCols) return;
        const index = parseInt(document.activeElement?.ariaRowIndex || '0', 0);
        const child = this.grid?.nativeElement.childNodes.item(index + next) as HTMLElement;
        if (!child || !child['getElementsByTagName']) return;
        const input = child.getElementsByTagName('input').item(0);
        input?.focus();
    }

    create() {
        this.dialogRef.close(this.table);
    }

    onEnter(index: number) {
        this.table.columns.splice(index + 1, 0, {});
        let me = this;
        setTimeout(() => {
            me.focusNextLine();
        }, 100);
    }

}
