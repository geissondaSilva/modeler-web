import { InjectionToken } from '@angular/core';

export interface Configuration {
    border: number,
    headerHeight: number,
    navHeight: number,
    colSize: number,
    gridSize: number,
    gridColor: string,
    gridLineColor: string,
}

export const CONFIGURATION_DATA: Configuration = {
    border: 6,
    headerHeight: 24,
    navHeight: 50,
    colSize: 24,
    gridSize: 30,
    gridColor: '#f0f0f0',
    gridLineColor: '#f0ebeb'
}

export const CONFIGURATION = new InjectionToken<Configuration>('designer_config');