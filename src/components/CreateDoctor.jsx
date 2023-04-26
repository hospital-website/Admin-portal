import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import MoonLoader from "react-spinners/ClipLoader";
const CreateDoctor = () => {
  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);
  const [data, setData] = useState({
    name: "",
    specialities: [],
    degrees: [],
    img: "",
    exp: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addDoc(collection(db, "doctors"), {
        ...data,
        timeStamp: serverTimestamp(),
      });
      console.log(res);
      setData({
        name: "",
        specialities: [],
        degrees: [],
        img: "",
        exp: "",
      });
      setFile("");
      setPerc(null);
      alert("Doctor details added successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    const id = e.target.id;
    let value = e.target.value;
    if (id === "degrees" || id === "specialities") value = value.split(",");
    setData({ ...data, [id]: value });
  };

  return (
    <div className="md:py-15 py-10">
      <form
        onSubmit={handleSubmit}
        className="grid justify-center gap-5 md:py-15 py-10 md:px-0 px-5 shadow-2xl h-fit rounded-lg md:w-[60vw] w-[90vw] mx-auto"
      >
        <div className="py-2">
          <label
            htmlFor="name"
            className="uppercase font-work text-primary text-base"
          >
            Doctor Name :{" "}
          </label>
          <input
            type="text"
            id="name"
            onChange={handleChange}
            value={data.name}
            className="rounded border-b border-secondary outline-none text-secondary text-sm font-work px-1 py-0.5"
            placeholder="Enter Full Name"
          />
        </div>

        <label
          className="uppercase font-work text-primary flex gap-3 items-center text-base pt-2"
          htmlFor="image"
        >
          Doctor Image :{" "}
          <button className="text-base flex items-center gap-3 font-work px-3 py-1 bg-accent text-primary">
            <DriveFolderUploadOutlinedIcon style={{ cursor: "pointer" }} />
            Upload
          </button>
        </label>
        <input
          type="file"
          id="image"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
          className="border-b border-secondary outline-none rounded text-secondary text-sm font-work px-1 py-0.5"
        />

        <label
          className="uppercase font-work text-primary text-base mt-2"
          htmlFor="degrees"
        >
          Degree{" "}
          <span className="text-slate-500 text-xs">
            (if multiple degrees, then separate them by using commas):{" "}
          </span>
        </label>
        <input
          type="text"
          id="degrees"
          onChange={handleChange}
          value={data.degrees}
          className="border-b border-secondary outline-none text-secondary rounded text-sm font-work px-1  py-1 mb-4 "
          placeholder="Enter Degree"
        />

        <label
          className="uppercase font-work text-primary text-base mt-2"
          htmlFor="specialities"
        >
          Speciality{" "}
          <span className="text-slate-500 text-xs">
            (if multiple specialities, then separate them by using commas):{" "}
          </span>
        </label>
        <input
          type="text"
          id="specialities"
          onChange={handleChange}
          value={data.specialities}
          className="border-b border-secondary outline-none rounded text-secondary text-sm font-work px-1 py-1 mb-4"
          placeholder="Enter Specialty"
        />

        <div className=" mt-2 mb-8">
          <label
            className="uppercase font-work text-primary text-base"
            htmlFor="exp"
          >
            Experience{" "}
            <span className="text-slate-500 text-xs">(In Years)</span> {" :  "}
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
            Add Doctor
          </button>
        )}
      </form>
    </div>
  );
};

export default CreateDoctor;
