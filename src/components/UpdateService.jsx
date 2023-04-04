import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useParams } from "react-router-dom";
import MoonLoader from "react-spinners/ClipLoader";
const UpdateService = () => {
  const params = useParams();
  const id = params.id;

  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, "services", id);
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
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "services", id), data);
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
              htmlFor="name"
              className="uppercase font-work text-primary text-base"
            >
              Service Name :{" "}
            </label>
            <input
              type="text"
              id="name"
              value={data.name}
              placeholder="Enter Service Name"
              className="border-b border-secondary rounded outline-none text-secondary text-sm font-work px-1 py-0.5"
              onChange={handleChange}
            />
          </div>

          <label
            className="uppercase font-work text-black text-base"
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
            className="uppercase font-work text-black text-base"
            htmlFor="img"
          >
            Change Image :{" "}
            <DriveFolderUploadOutlinedIcon style={{ cursor: "pointer" }} />
          </label>
          <input
            type="file"
            id="img"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />

          <label
            className="uppercase font-work text-black text-base mt-4"
            htmlFor="desc"
          >
            Service Description :{" "}
          </label>
          <textarea
            name=""
            id="desc"
            cols="30"
            rows="5"
            value={data.desc}
            onChange={handleChange}
            placeholder="Write Service Description"
            className="w-full text-secondary text-sm font-work border border-secondary p-1 outline-none"
          ></textarea>

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
              Update Service
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default UpdateService;
