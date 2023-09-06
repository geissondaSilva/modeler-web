import { Injectable, Inject } from '@angular/core';
import { DataService } from './data.service';
import { DesignerService } from './designer.service';
import { CONFIGURATION, Configuration } from '../tokens/configuration';
import { RelationalMap } from '../models/relational-map';
import { Point } from '../models/point';

@Injectable({ providedIn: 'root' })
export class RelationalService {

    public mouseDown: any;
    public mouseMove: any;
    public mouseUp: any;
    public houverPoint: any;

    public map: RelationalMap[] = [];

    public ref?: RelationalMap;
    public refHover?: RelationalMap;

    startX = 0;
    startY = 0;

    constructor(
        private data: DataService,
        private designer: DesignerService,
        @Inject(CONFIGURATION) private config: Configuration,
    ) {
        this.mouseDown = this.onMouseDown.bind(this);
        this.mouseMove = this.onMouseMove.bind(this);
        this.houverPoint = this.onMouseHover.bind(this);
        this.mouseUp = this.onMouseUp.bind(this);
    }

    public active() {
        window.addEventListener('mousedown', this.mouseDown);
        window.addEventListener('mousemove', this.houverPoint);
        this.buildMap();
        this.designer.refresh();
    }

    private buildMap() {
        const newMap: RelationalMap[] = [];
        this.data.diagram.schemas.forEach((schema, schemaIndex) => {
            schema.tables.forEach((table, tableIndex) => {
                const x = table.x;
                const y = table.y + this.config.headerHeight + (this.config.colSize / 2);
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
        this.data.updatePonints(newMap.map(map => this.toOptions(map)));
    }

    private toOptions(map: RelationalMap): Point {
        return {
            x: map.x,
            y: map.y,
            hover: false
        };
    }

    private onMouseDown(event: MouseEvent) {
        const x = event.x;
        const y = event.y;
        this.ref = this.findPoint({x, y});
        if (this.ref) {
            this.startX = this.ref.x;
            this.startY = this.ref.y;
            window.addEventListener('mousemove', this.mouseMove);
            window.addEventListener('mouseup', this.mouseUp);
        }
    }

    private findPoint(position: { x: number, y: number }) {
        let { x, y } = position;
        y = y - this.config.navHeight;
        const precision = 4;
        return this.map.find(map => (x >= map.x - precision && x <= map.x + precision) && (y >= map.y - precision && y <= map.y + precision))
    }

    private onMouseMove(event: MouseEvent) {
        this.data.setRelationDesign({
            startX: this.startX,
            startY: this.startY,
            endX: event.x,
            endY: event.y - this.config.navHeight
        });
        this.designer.refresh();
    }

    private onMouseHover(event: MouseEvent) {
        const ref = this.findPoint(event);
        if (this.refHover != ref) {
            this.refHover = ref;
            const newPoints = this.data.options.points.map(point => {
                return {...point, hover: ref !== undefined && ref.x === point.x && ref.y === point.y}
            });
            this.data.updatePonints(newPoints);
            this.designer.refresh();
        }
    }

    private onMouseUp(event: MouseEvent) {
        const ref = this.findPoint(event);
        if (ref) {
            this.data.addRelation({
                startX: this.startX,
                startY: this.startY,
                endX: ref.x,
                endY: ref.y
            }, ref);
        }
        this.data.setRelationDesign(undefined);
        window.removeEventListener('mousemove', this.mouseMove);
        window.removeEventListener('mouseup', this.mouseUp);
        this.designer.refresh();
    }

}