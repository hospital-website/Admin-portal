import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useParams } from "react-router-dom";

const UpdateDoctor = () => {
  const params = useParams();
  const id = params.id;

  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, "doctors", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getData();
  }, [id]);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = (e) => {
    const id = e.target.id;
    let value = e.target.value;
    if (id === "degrees" || id === "specialities") value = value.split(",");
    setData({ ...data, [id]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "doctors", id), data);
      alert("Data updated successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleUpdate}>
          <label htmlFor="name">Doctor's Name : </label>
          <input
            type="text"
            id="name"
            value={data.name}
            onChange={handleChange}
          />
          <br />
          <br />
          <label htmlFor="image">Image : </label>
          <div>
            <img
              src={data.img}
              alt=""
              style={{
                maxWidth: "30vw",
                maxHeight: "50vh",
              }}
            />
          </div>
          <br />
          <br />
          <label htmlFor="img">
            Change Image :{" "}
            <DriveFolderUploadOutlinedIcon style={{ cursor: "pointer" }} />
          </label>
          <input
            type="file"
            id="img"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />
          <br />
          <br />
          <label htmlFor="specialities">Specialities : </label>
          <input
            type="text"
            id="specialities"
            value={data.specialities}
            onChange={handleChange}
          />
          <br />
          <br />
          <label htmlFor="degrees">Degrees : </label>
          <input
            type="text"
            id="degrees"
            value={data.degrees}
            onChange={handleChange}
          />
          <br />
          <br />
          <button type="submit" disabled={per !== null && per < 100}>
            Update Doctor
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateDoctor;
