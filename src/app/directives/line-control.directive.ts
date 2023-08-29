import { ContentChildren, Directive, QueryList } from '@angular/core';
import { ColControlDirective } from './col-control.directive';

@Directive({
    selector: '[appLineControl]'
})
export class LineControlDirective {

    @ContentChildren(ColControlDirective, {descendants: true}) cols: QueryList<ColControlDirective> | undefined;

    constructor() { }

    public focusCol(colIndex: number) {
        if (!this.cols) return;
        const col = this.cols.get(colIndex);
        if (col) {
            col.focus();
        }
    }

}
