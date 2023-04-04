import "./datatable.scss";

import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { db } from "../firebase";

const ManageDoctor = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "doctors"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "doctors", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const actionColumn = [
    { field: "name", headerName: "Doctor Name", width: 250 },
    {
      field: "img",
      headerName: "Image",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.img} alt="avatar" />
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: "degrees",
      headerName: "Degrees",
      width: 200,
    },
    {
      field: "specialities",
      headerName: "Specialities",
      width: 200,
    },
    {
      field: "exp",
      headerName: "Experience (in years)",
      width: 180,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const url = `/update-doctor/${params.row.id}`;
        return (
          <div className="cellAction">
            <Link to={url} style={{ textDecoration: "none" }}>
              <div className="viewButton">View / Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable mb-[120px]">
      <div className="datatableTitle">
        Manage Doctors
        <Link to="/create-doctor" className="link">
          Add New Doctor
        </Link>
      </div>
      <Box sx={{ height: "80vh", width: "auto", marginTop: "2%" }}>
        <DataGrid
          className="datagrid"
          rows={data}
          columns={actionColumn}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 7,
              },
            },
          }}
          pageSizeOptions={[7]}
        />
      </Box>
    </div>
  );
};

export default ManageDoctor;
