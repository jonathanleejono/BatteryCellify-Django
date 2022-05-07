import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";

const headCells = [
  {
    id: "edit",
    numeric: false,
    disablePadding: false,
    label: "Edit",
  },
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "Id",
  },
  {
    id: "cellNameId",
    numeric: false,
    disablePadding: false,
    label: "Cell Name Id",
  },
  {
    id: "cycles",
    numeric: false,
    disablePadding: false,
    label: "Cycles",
  },
  {
    id: "cathode",
    numeric: false,
    disablePadding: false,
    label: "Cathode",
  },
  {
    id: "anode",
    numeric: false,
    disablePadding: false,
    label: "Anode",
  },
  {
    id: "capacityAh",
    numeric: false,
    disablePadding: false,
    label: "Capacity (Ah)",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "source",
    numeric: false,
    disablePadding: false,
    label: "Source",
  },
  {
    id: "temperatureC",
    numeric: false,
    disablePadding: false,
    label: "Temp (C)",
  },
  {
    id: "maxStateOfCharge",
    numeric: false,
    disablePadding: false,
    label: "Max SoC",
  },
  {
    id: "minStateOfCharge",
    numeric: false,
    disablePadding: false,
    label: "Min SoC",
  },
  {
    id: "depthOfDischarge",
    numeric: false,
    disablePadding: false,
    label: "DoD",
  },
  {
    id: "chargeCapacityRate",
    numeric: false,
    disablePadding: false,
    label: "Charge C Rate",
  },
  {
    id: "dischargeCapacityRate",
    numeric: false,
    disablePadding: false,
    label: "Discharge C Rate",
  },
];

function EnhancedTableHeader(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? "right" : "left"}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHeader.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHeader;
