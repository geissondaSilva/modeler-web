import { Component, OnInit } from '@angular/core';
import { DesignerService } from './services/designer.service';
import { DataService } from './services/data.service';
import { Options } from './models/options';
import { TableService } from './services/table.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private designer: DesignerService,
        private data: DataService,
        private tableService: TableService,
    ) {}

    ngOnInit(): void {
        this.designer.init();
        this.registerFunctions();
        this.data.get().subscribe(diagram => {
            this.designer.design(diagram, this.data.options);
        });
    }

    newTable() {
       this.tableService.newTable();
    }

    moveTable() {
        this.tableService.moveTable();
    }

    log() {
        console.log(this.data.diagram);
    }

    exportar() {
        this.designer.export();
    }

    private registerFunctions() {
        this.designer.canvas?.addEventListener('dblclick', this.tableService.editTableFn);
    }
}
