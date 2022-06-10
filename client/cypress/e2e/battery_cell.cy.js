/// <reference types="cypress" />

import { capitalCase } from 'change-case';

describe('Battery Cell Journey', () => {
  // make this before each, not before
  beforeEach(() => {
    cy.task('db:reset');
    cy.task('db:seed:user');
    cy.loginApi();
  });

  it('should create, get, update, and delete battery cell', () => {
    cy.visit('/add-battery-cell');

    const mock_battery_cell = {
      cell_name_id: 'HNEI_18650_NMC_LCO_25C_0-100_0.5/1.5C_b',
      cycles: 1113.0,
      cathode: 'NMC-LCO',
      anode: 'graphite',
      capacity_ah: 2.8,
      type: '18650',
      source: 'HNEI',
      temperature_c: 25.0,
      max_state_of_charge: 100.0,
      min_state_of_charge: 0.0,
      depth_of_discharge: 100.0,
      charge_capacity_rate: 0.5,
      discharge_capacity_rate: 1.5,
    };

    cy.getByDataCy('cell_name_id').type(mock_battery_cell.cell_name_id);
    cy.getByDataCy('cycles').type(mock_battery_cell.cycles);
    cy.getByDataCy('cathode').click();
    cy.get(`[data-value=${mock_battery_cell.cathode}]`).click();
    cy.getByDataCy('anode').click();
    cy.get(`[data-value=${mock_battery_cell.anode}]`).click();
    cy.getByDataCy('capacity_ah').type(mock_battery_cell.capacity_ah);
    cy.getByDataCy('type').click();
    cy.get(`[data-value=${mock_battery_cell.type}]`).click();
    cy.getByDataCy('source').click();
    cy.get(`[data-value=${mock_battery_cell.source}]`).click();
    cy.getByDataCy('temperature_c').type(mock_battery_cell.temperature_c);
    cy.getByDataCy('max_state_of_charge').type(mock_battery_cell.max_state_of_charge);
    cy.getByDataCy('min_state_of_charge').type(mock_battery_cell.min_state_of_charge);
    cy.getByDataCy('depth_of_discharge').type(mock_battery_cell.depth_of_discharge);
    cy.getByDataCy('charge_capacity_rate').type(mock_battery_cell.charge_capacity_rate);
    cy.getByDataCy('discharge_capacity_rate').type(mock_battery_cell.discharge_capacity_rate);

    cy.get("button[type='submit']").click();

    cy.contains(/Battery cell created/i).should('be.visible');

    cy.visit('/all-battery-cells');

    // query params aren't tested

    cy.getByDataCy('battery-cells-table').contains('td', mock_battery_cell.cell_name_id);
    cy.getByDataCy('battery-cells-table').contains('td', mock_battery_cell.cathode);
    cy.getByDataCy('battery-cells-table').contains('td', capitalCase(mock_battery_cell.anode));
    cy.getByDataCy('battery-cells-table').contains('td', mock_battery_cell.capacity_ah);
    cy.getByDataCy('battery-cells-table').contains('td', capitalCase(mock_battery_cell.type));
    cy.getByDataCy('battery-cells-table').contains('td', mock_battery_cell.source.toUpperCase());
    cy.getByDataCy('battery-cells-table').contains('td', mock_battery_cell.temperature_c);
    cy.getByDataCy('battery-cells-table').contains('td', mock_battery_cell.max_state_of_charge);
    cy.getByDataCy('battery-cells-table').contains('td', mock_battery_cell.min_state_of_charge);
    cy.getByDataCy('battery-cells-table').contains('td', mock_battery_cell.depth_of_discharge);
    cy.getByDataCy('battery-cells-table').contains('td', mock_battery_cell.charge_capacity_rate);
    cy.getByDataCy('battery-cells-table').contains('td', mock_battery_cell.discharge_capacity_rate);

    cy.getByDataCy('edit-battery-cell').click();

    cy.get("[data_cy='cell_name_id-input']").clear().type('CALCE_18650_NMC_LCO_25C_0-100_0.5/1.5C_b');

    cy.get("button[type='submit']").click();

    cy.contains(/Battery Cell Modified.../i).should('be.visible');

    cy.visit('/all-battery-cells');

    cy.getByDataCy('battery-cells-table').contains('td', 'CALCE_18650_NMC_LCO_25C_0-100_0.5/1.5C_b');

    cy.getByDataCy('battery-cell-checkbox').click();

    cy.getByDataCy('delete-icon').click();

    cy.getByDataCy('modal-delete-confirm').click();

    // message in the backend controller
    cy.contains(/Success! Battery cell removed/i).should('be.visible');
  });
});
