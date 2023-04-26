import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useParams } from "react-router-dom";
import MoonLoader from "react-spinners/ClipLoader";
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
        <form
          onSubmit={handleUpdate}
          className="grid justify-center gap-5 md:py-15 py-10 md:px-0 px-5 shadow-2xl h-fit rounded-lg md:w-[60vw] w-[90vw] mx-auto"
        >
          <div>
            <label
              className="uppercase font-work text-primary text-base"
              htmlFor="name"
            >
              Doctor's Name :{" "}
            </label>
            <input
              type="text"
              id="name"
              value={data.name}
              onChange={handleChange}
              className="rounded border-b border-secondary outline-none text-secondary text-sm font-work px-1 py-0.5"
              placeholder="Enter Full Name"
            />
          </div>

          <label
            className="uppercase font-work text-primary text-base pt-2"
            htmlFor="image"
          >
            Image :{" "}
          </label>
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

          <label
            htmlFor="img"
            className="uppercase font-work flex gap-3 items-center text-primary text-base pt-2"
          >
            Change Image :{" "}
            <button className="text-base flex items-center gap-3 font-work px-3 py-1 bg-accent text-primary">
              <DriveFolderUploadOutlinedIcon style={{ cursor: "pointer" }} />
              Upload
            </button>
          </label>
          <input
            type="file"
            id="img"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
            className="border-b border-secondary outline-none rounded text-secondary text-sm font-work px-1 py-0.5"
          />

          <label
            className="uppercase font-work text-primary text-base mt-2"
            htmlFor="degrees"
          >
            Degrees :{" "}
          </label>
          <input
            type="text"
            id="degrees"
            value={data.degrees}
            onChange={handleChange}
            className="border-b border-secondary outline-none text-secondary rounded text-sm font-work px-1  py-1 mb-4 "
            placeholder="Enter Degree"
          />

          <label
            className="uppercase font-work text-primary text-base mt-2"
            htmlFor="specialities"
          >
            Specialities :{" "}
          </label>
          <input
            type="text"
            id="specialities"
            value={data.specialities}
            onChange={handleChange}
            className="border-b border-secondary outline-none rounded text-secondary text-sm font-work px-1 py-1 mb-4"
            placeholder="Enter Specialty"
          />

          <div>
            <label
              className="uppercase font-work text-primary text-base"
              htmlFor="exp"
            >
              Experience (in years) :{" "}
            </label>
            <input
              type="text"
              id="exp"
              value={data.exp}
              onChange={handleChange}
              placeholder="Enter Years Of Experience"
              className="border-b rounded border-secondary outline-none text-secondary text-sm font-work px-1 py-0.5"
            />
          </div>
          <br />

          {/* <button type="submit" disabled={per !== null && per < 100}>
            Update Doctor
          </button> */}
          {per !== null && per < 100 ? (
            <button
              disabled
              type="submit"
              className="bg-primary px-4 py-2 my-4 text-base text-white uppercase font-work mx-auto w-[138.26px] opacity-90 rounded"
            >
              <MoonLoader color={"white"} size={34} />
            </button>
          ) : (
            <button
              type="submit"
              className="bg-primary px-4 py-4 my-4 text-base text-white uppercase font-work mx-auto  rounded"
            >
              Update Doctor
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default UpdateDoctor;
