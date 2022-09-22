/// <reference types="cypress" />

import { capitalCase } from 'change-case';
import {
  apiBatteryCellsUrl,
  authUserUrl,
  createBatteryCellUrl,
  getAllBatteryCellsListUrl,
} from '../../src/constants/apiUrls';
import { userData } from '../support/commands';

const mock_battery_cell = {
  id: 1,
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

// this gets displayed by fixture updated_battery_cells.json
const mock_updated_battery_cell = {
  cell_name_id: 'CALCE_18650_NMC_LCO_25C_0-100_0.5/1.5C_b',
};

describe('Battery Cell Journey', () => {
  // use beforeEach
  beforeEach(() => {
    cy.loginUserCommand();

    cy.intercept('GET', `${authUserUrl}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          email: userData.email,
          name: userData.name,
        },
      });
    }).as('mockGetAuthUser');

    cy.intercept('POST', `${createBatteryCellUrl}`, (req) => {
      req.reply({
        statusCode: 201,
        body: mock_battery_cell,
      });
    }).as('mockCreateBatteryCell');

    cy.intercept('PATCH', `${apiBatteryCellsUrl}/${mock_battery_cell.id}`, (req) => {
      req.reply({
        statusCode: 200,
        body: mock_battery_cell,
      });
    }).as('mockPatchBatteryCell');

    cy.intercept('DELETE', `${apiBatteryCellsUrl}/${mock_battery_cell.id}`, (req) => {
      req.reply({
        statusCode: 200,
        body: { message: 'Success! Battery cell removed' },
      });
    }).as('mockDeleteBatteryCell');
  });

  it('should create battery cell', () => {
    cy.visit('/add-battery-cell');

    cy.wait('@mockGetAuthUser');

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
  });

  it('gets all battery cells', () => {
    cy.intercept(
      'GET',
      `${getAllBatteryCellsListUrl}?cathode=&anode=&type=&source=&cell_name_id=&sort_by=&sort_direction=&offset_skip=0&limit=20`,
      {
        fixture: 'battery_cells.json',
      }
    ).as('mockGetAllBatteryCells');

    cy.visit('/all-battery-cells');

    cy.wait('@mockGetAuthUser');
    cy.wait('@mockGetAllBatteryCells');

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
  });

  it('should edit battery cell', () => {
    cy.intercept(
      'GET',
      `${getAllBatteryCellsListUrl}?cathode=&anode=&type=&source=&cell_name_id=&sort_by=&sort_direction=&offset_skip=0&limit=20`,
      {
        fixture: 'updated_battery_cells.json',
      }
    ).as('mockGetAllUpdatedBatteryCells');

    cy.visit('/all-battery-cells');

    cy.wait('@mockGetAllUpdatedBatteryCells');
    cy.wait('@mockGetAuthUser');

    cy.getByDataCy('edit-battery-cell').click();

    cy.get("[data_cy='cell_name_id-input']").clear().type(mock_updated_battery_cell.cell_name_id);

    cy.get("button[type='submit']").click();

    cy.contains(/Battery Cell Modified.../i).should('be.visible');

    // after editing battery cell, the user is automatically directed to /all-battery-cells
    cy.getByDataCy('battery-cells-table').contains('td', mock_updated_battery_cell.cell_name_id);
  });

  it('should delete battery cell', () => {
    cy.intercept(
      'GET',
      `${getAllBatteryCellsListUrl}?cathode=&anode=&type=&source=&cell_name_id=&sort_by=&sort_direction=&offset_skip=0&limit=20`,
      {
        fixture: 'updated_battery_cells.json',
      }
    ).as('mockGetAllUpdatedBatteryCells');

    cy.visit('/all-battery-cells');

    cy.wait('@mockGetAuthUser');
    cy.wait('@mockGetAllUpdatedBatteryCells');

    cy.getByDataCy('battery-cell-checkbox').click();

    cy.getByDataCy('delete-icon').click();

    cy.getByDataCy('modal-delete-confirm').click();

    cy.wait('@mockDeleteBatteryCell');

    cy.contains(/Success! Battery cell removed/i).should('be.visible');
  });
});
