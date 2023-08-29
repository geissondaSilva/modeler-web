import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NewTableComponent } from '../components/new-table/new-table.component';

@Directive({
    selector: '[appColControl]'
})
export class ColControlDirective {

    private _rowIndex: number = 0;
    private _colIndex: number = 0;

    @Input() set rowIndex(value: number) {
        this._rowIndex = value;
    }

    @Input() set colIndex(value: number) {
        this._colIndex = value;
    }

    get rowIndex() {
        return this._rowIndex;
    }

    get colIndex() {
        return this._colIndex;
    }

    constructor(
        private element: ElementRef<HTMLElement>,
        private component: NewTableComponent,
    ) {
    }

    @HostListener('keydown', ['$event'])
    public keyDown(event: KeyboardEvent) {
        if (!event.ctrlKey) return;
        switch (event.key) {
            case 'ArrowDown': this.nextLine(); event.preventDefault(); break;
            case 'ArrowUp': this.previusLine(); event.preventDefault(); break;
            case 'ArrowRight': this.nextCol(); event.preventDefault(); break;
            case 'ArrowLeft': this.previusCol(); event.preventDefault(); break;
        }
    }

    nextLine() {
        let rowIndex = 0;
        if (this.rowIndex + 1 < this.component.maxLines) {
            rowIndex = this.rowIndex + 1;
        }
        this.componentFocus(rowIndex, this.colIndex);
    }

    previusLine() {
        let rowIndex = this.component.maxLines - 1;
        if (this.rowIndex > 0) {
            rowIndex = this.rowIndex - 1;
        }
        this.componentFocus(rowIndex, this.colIndex);
    }

    nextCol() {
        // TODO: not implemented
    }

    previusCol() {
        // TODO: not implemented
    }
    
    private componentFocus(row: number, col: number) {
        let me = this;
        setTimeout(() => {
            this.component.focus(row, col);
        }, 100);
    }

    @HostListener('window:keydown.control.enter', ['$event'])
    public handlerEnter(event: KeyboardEvent) {
        if (!this.element.nativeElement.contains(event.target as any)) {
            return;
        }
        event.preventDefault();
        if (event.ctrlKey) {
            this.element.nativeElement.blur();
        }
        this.component.onEnter(this.rowIndex ? this.rowIndex : 0);
    }

    focus() {
        this.element.nativeElement.focus();
    }

}
