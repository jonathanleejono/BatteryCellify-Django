import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

import { useEffect, useState } from "react";
import BatteryCell from "./BatteryCell";
import Wrapper from "../assets/wrappers/BatteryCellsContainer";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./Loading";
import { getAllBatteryCells } from "../features/allBatteryCells/allBatteryCellsSlice";
import PageBtnContainer from "./PageBtnContainer";
import {
  editBatteryCell,
  deleteBatteryCell,
  setEditBatteryCell,
} from "../features/batteryCell/batteryCellSlice";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";

const DataGridTable = () => {
  const {
    batteryCells,
    isLoading,
    totalBatteryCells,
    numOfPages,
    search,
    searchCathode,
    searchAnode,
    searchType,
    searchSource,
  } = useSelector((store) => store.allBatteryCells);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBatteryCells());
  }, [dispatch, search, searchCathode, searchAnode, searchType, searchSource]);

  const handleEditTest = (params) => {
    dispatch(
      setEditBatteryCell({
        editBatteryCellId: params.id,
        cellNameId: params.row.cellNameId,
        cycles: params.row.cycles,
        cathode: params.row.cathode,
        anode: params.row.anode,
        capacityAh: params.row.capacityAh,
        type: params.row.type,
        source: params.row.source,
        temperatureC: params.row.temperatureC,
        maxStateOfCharge: params.row.maxStateOfCharge,
        minStateOfCharge: params.row.minStateOfCharge,
        depthOfDischarge: params.row.depthOfDischarge,
        chargeCapacityRate: params.row.chargeCapacityRate,
        dischargeCapacityRate: params.row.dischargeCapacityRate,
      })
    );
  };

  const handleEdit = () => {
    return (
      <Link
        to="/edit-battery-cell"
        className="btn edit-btn"
        onClick={() => {
          dispatch(
            setEditBatteryCell({
              editBatteryCellId: selectedRow.id,
              cellNameId: selectedRow.row.cellNameId,
              cycles: selectedRow.row.cycles,
              cathode: selectedRow.row.cathode,
              anode: selectedRow.row.anode,
              capacityAh: selectedRow.row.capacityAh,
              type: selectedRow.row.type,
              source: selectedRow.row.source,
              temperatureC: selectedRow.row.temperatureC,
              maxStateOfCharge: selectedRow.row.maxStateOfCharge,
              minStateOfCharge: selectedRow.row.minStateOfCharge,
              depthOfDischarge: selectedRow.row.depthOfDischarge,
              chargeCapacityRate: selectedRow.row.chargeCapacityRate,
              dischargeCapacityRate: selectedRow.row.dischargeCapacityRate,
            })
          );
        }}
      >
        Edit
      </Link>
    );
  };

  // const handleDelete = () => {
  //   console.log(arrSingleId);
  //   return (
  //     <Button
  //       className="btn edit-btn"
  //       onClick={() => dispatch(deleteBatteryCell(arrSingleId))}
  //     >
  //       Delete
  //     </Button>
  //   );
  // };

  const handleDeleteMany = () => {
    console.log(arrIds);
    for (let id in arrIds) {
      dispatch(deleteBatteryCell(arrIds[id]));
    }
  };

  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      width: 110,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              // backgroundColor: "whitesmoke",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            {" "}
            <Link to="/edit-battery-cell">
              <IconButton
                onClick={() => {
                  dispatch(
                    setEditBatteryCell({
                      id: params.row.id,
                      cellNameId: params.row.cellNameId,
                      cycles: params.row.cycles,
                      cathode: params.row.cathode,
                      anode: params.row.anode,
                      capacityAh: params.row.capacityAh,
                      type: params.row.type,
                      source: params.row.source,
                      temperatureC: params.row.temperatureC,
                      maxStateOfCharge: params.row.maxStateOfCharge,
                      minStateOfCharge: params.row.minStateOfCharge,
                      depthOfDischarge: params.row.depthOfDischarge,
                      chargeCapacityRate: params.row.chargeCapacityRate,
                      dischargeCapacityRate: params.row.dischargeCapacityRate,
                    }),
                    console.log("params.id99999: ", params.id),
                    console.log("params.row.id99999: ", params.row.id)
                  );
                }}
              >
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton onClick={() => console.log("PARAMS ID: ", params.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
      disableClickEventBubbling: true,
    },
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "cellNameId",
      headerName: "cellNameId",
      width: 150,
      editable: true,
    },
    {
      field: "cycles",
      headerName: "cycles",
      width: 150,
      editable: true,
    },
    {
      field: "cathode",
      headerName: "cathode",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "anode",
      headerName: "anode",
      description: "This is an anode.",
      sortable: false,
      width: 160,
    },
    {
      field: "type",
      headerName: "type",
      sortable: false,
      width: 160,
    },
    {
      field: "source",
      headerName: "source",
      sortable: false,
      width: 160,
    },
  ];

  const [arrSingleId, setArrSingleId] = useState([]);

  const [arrIds, setArrIds] = useState([]);

  const [selectedRow, setSelectedRow] = useState([]);

  let testRow = [];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <button
        onClick={handleDeleteMany}
        style={{ margin: "20px", background: "red", color: "white" }}
      >
        Delete
      </button>
      <DataGrid
        rows={batteryCells}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        // disableSelectionOnClick
        getRowId={(row) => row.id}
        onSelectionModelChange={(ids) => {
          setArrIds(ids);
          setArrSingleId(ids);
        }}
        onRowClick={(data) => {
          console.log("row prop click: ", data);
          console.log("row prop click _ data.row: ", data.row);
          setSelectedRow(data);
          testRow = data;
        }}
        sx={{
          //   backgroundColor: "primary.main",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
      />
    </div>
  );
};

export default DataGridTable;
