import { Injectable, Inject } from '@angular/core';
import { DataService } from './data.service';
import { DesignerService } from './designer.service';
import { CONFIGURATION, Configuration } from '../tokens/configuration';
import { RelationalMap } from '../models/relational-map';

@Injectable({ providedIn: 'root' })
export class RelationalService {

    public mouseDown: any;
    public mouseMove: any;

    public map: RelationalMap[] = [];

    public ref?: RelationalMap;
    startX = 0;
    startY = 0;

    constructor(
        private data: DataService,
        private designer: DesignerService,
        @Inject(CONFIGURATION) private config: Configuration,
    ) {
        this.mouseDown = this.onMouseDown.bind(this);
        this.mouseMove = this.onMouseMove.bind(this);
    }

    public active() {
        window.addEventListener('mousedown', this.mouseDown);
        this.buildMap();
    }

    private buildMap() {
        const newMap: RelationalMap[] = [];
        this.data.diagram.schemas.forEach((schema, schemaIndex) => {
            schema.tables.forEach((table, tableIndex) => {
                const x = table.x;
                const y = table.y + this.config.headerHeight + (this.config.colSize / 2) - 5; // porque 5 de diferença
                newMap.push({
                    position: tableIndex,
                    schema: schemaIndex,
                    x: x,
                    y: y
                });
                newMap.push({
                    position: tableIndex,
                    schema: schemaIndex,
                    x: x + table.width,
                    y: y
                });
            });
        });
        this.map = newMap;
    }

    private onMouseDown(event: MouseEvent) {
        const x = event.x;
        const y = event.y - this.config.navHeight;
        this.ref = this.map.find(map => (x >= map.x - 2 && x <= map.x + 2) && (y >= map.y - 2 && y <= map.y + 2));
        if (this.ref) {
            this.startX = this.ref.x;
            this.startY = this.ref.y;
            window.addEventListener('mousemove', this.mouseMove);
        }
    }

    private onMouseMove(event: MouseEvent) {
        this.data.addRelation({
            startX: this.startX,
            startY: this.startY + 5,
            endX: event.x,
            endY: event.y - this.config.navHeight + 5
        });
        this.designer.refresh();
    }

}