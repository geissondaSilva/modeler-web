import { Injectable, Inject } from '@angular/core';
import { CONFIGURATION, Configuration } from '../tokens/configuration';
import { Diagrama } from '../models/diagrama';
import { Options } from '../models/options';
import { Table } from '../models/table';
import { Column } from '../models/column';

@Injectable({ providedIn: 'root' })
export class DesignerService {

    private designer?: HTMLElement;
    private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D;

    constructor(
        @Inject(CONFIGURATION) private config: Configuration,
    ) {
        
    }

    init() {
        this.designer = document.getElementById('designer') as HTMLElement;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.designer?.clientWidth || 500;
        this.canvas.height = this.designer?.clientHeight || 500;
        this.designer?.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    get context() {
        if (this.ctx) {
            return this.ctx;
        }
        throw new Error("this context canvas is not defined!")
    }

    get width(): number {
        return this.canvas?.width || 500;
    }

    get height(): number {
        return this.canvas?.height || 500;
    }

    get clientHeight(): number {
        return this.canvas?.clientHeight || 500;
    }

    get clientWidth(): number {
        return this.canvas?.clientWidth || 500;
    }

    design(diagram: Diagrama, options: Options) {
        this.context.clearRect(0, 0, this.width, this.height);
        this.designGrid();
        this.context.font = "12px arial";
        diagram?.schemas?.forEach(schem => {
            schem?.tables?.forEach(table => {
                this.designTable(table, options);
            });
        });
    }

    private designGrid() {
        this.context.beginPath();
        this.context.moveTo(0,0);
        this.context.lineTo(this.clientWidth, 0);
        this.context.lineTo(this.clientWidth, this.clientHeight);
        this.context.lineTo(0, this.clientHeight);
        this.context.lineTo(0, 0);
        this.context.fillStyle = this.config.gridColor;
        this.context.fill();
        this.context.closePath();
        this.context.strokeStyle = this.config.gridLineColor;
        const size = this.config.gridSize;
        let lines = (this.clientHeight - (this.clientHeight % size)) / size;
        for (let i = 1; i <= lines; i++) {
            this.context.beginPath();
            const y = 0 + (i * size);
            this.context.moveTo(0, y);
            this.context.lineTo(this.clientWidth, y);
            this.context.stroke();
            this.context.closePath();
        }
        let cols = (this.clientWidth - (this.clientWidth % size)) / size;
        for (let i = 1; i <= cols; i++) {
            this.context.beginPath();
            const x = 0 + (i * size);
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.clientHeight);
            this.context.stroke();
            this.context.closePath();
        }
    }

    private designTable(table: Table, options: Options) {
        table.columns.forEach((col, index) => {
            this.designCol(table, col, index, options);
        });
        this.createBorder(table);
        this.createHeader(table);
        this.createName(table);
        if (options?.relational) {
            this.createRelation(table);
        }
    }

    private designCol(table: Table, col: Column, index: number, options: Options) {
        const { x, y } = table;
        this.context.beginPath();
        const colY = y + this.config.headerHeight + (index * this.config.colSize);
        this.context.moveTo(x, colY);
        this.context.lineTo(x, colY + this.config.colSize);
        this.context.lineTo(x + table.width, colY + this.config.colSize);
        this.context.lineTo(x + table.width, colY);
        this.context.lineTo(x, colY);
        this.context.fillStyle = 'white';
        this.context.fill();
        this.context.closePath();
        this.context.textAlign = 'start';
        this.context.fillStyle = 'black';
        this.context.textBaseline = "middle";
        this.context.fillText(`${col.name}:${col.type}`, x + 10, colY + (this.config.colSize / 2));
        this.context.closePath();
    }

    private createBorder(table: Table) {
        const { x, y, height, width } = table;
        const { border } = this.config;
        this.context.strokeStyle = table.color;
        this.context.beginPath();
        this.context.moveTo(x, y + border);
        this.context.lineTo(x, y + height - border);
        this.context.quadraticCurveTo(x, y + height, x + border, y + height);
        this.context.lineTo(x + width - border, y + height);
        this.context.quadraticCurveTo(x + width, y + height, x + width, y + height - border);
        this.context.lineTo(x + width, y + border);
        this.context.quadraticCurveTo(x + width, y, x + width - border, y);
        this.context.lineTo(x + border, y);
        this.context.quadraticCurveTo(x, y, x, y + border);
        this.context.closePath();
        this.context.stroke();
    }

    private createHeader(table: Table) {
        const { x, y, width } = table;
        const { border } = this.config;
        this.context.beginPath();
        this.context.moveTo(x, y + border);
        this.context.lineTo(x, y + this.config.headerHeight);
        this.context.lineTo(x + width, y + this.config.headerHeight);
        this.context.lineTo(x + width, y + border);
        this.context.quadraticCurveTo(x + width, y, x + width - border, y);
        this.context.lineTo(x + border, y);
        this.context.quadraticCurveTo(x, y, x, y + border);
        this.context.fillStyle = table.color;
        this.context.fill();
        this.context.closePath();
    }
    
    private createName(table: Table) {
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText(table.name, table.x + (table.width / 2), table.y + (this.config.headerHeight / 2) + 3);
    }

    private createRelation(table: Table) {
        this.context.fillStyle = "green";
        const radius = 3;
        const x = table.x;
        const y = table.y + this.config.headerHeight + (this.config.colSize / 2);
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
        this.context.arc(x + table.width, y, radius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();
    }
}