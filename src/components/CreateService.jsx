import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import MoonLoader from "react-spinners/ClipLoader";
const CreateService = () => {
  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);
  const [data, setData] = useState({
    name: "",
    img: "",
    desc: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addDoc(collection(db, "services"), {
        ...data,
        timeStamp: serverTimestamp(),
      });
      console.log(res);
      setData({
        name: "",
        img: "",
        desc: "",
      });
      setFile("");
      setPerc(null);
      alert("Service details added successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="md:py-15 py-10">
      <form
        onSubmit={handleSubmit}
        className="grid justify-center gap-5 md:py-15 py-10 md:px-0 px-5 shadow-2xl h-fit rounded-lg md:w-[60vw] w-[90vw] mx-auto"
      >
        <div className="my-4">
          <label
            className="uppercase font-work text-primary text-base"
            htmlFor="name"
          >
            Service Name :{" "}
          </label>
          <input
            type="text"
            id="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter Service Name"
            className="border-b border-secondary rounded outline-none text-secondary text-sm font-work px-1 py-0.5"
          />
        </div>

        <label
          className="uppercase font-work flex gap-3 items-center text-black text-base"
          htmlFor="img"
        >
          Service Image :{" "}
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
          placeholder="Upload Image"
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
            Add Service
          </button>
        )}
      </form>
    </div>
  );
};

export default CreateService;
