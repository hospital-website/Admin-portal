import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";

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
    <div>
      <form onSubmit={handleSubmit}>
        <br />
        <label htmlFor="name">Doctor Name : </label>
        <input
          type="text"
          id="name"
          onChange={handleChange}
          value={data.name}
        />
        <br />
        <br />
        <label htmlFor="image">
          Doctor Image :{" "}
          <DriveFolderUploadOutlinedIcon style={{ cursor: "pointer" }} />
        </label>
        <input
          type="file"
          id="image"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />
        <br />
        <br />
        <label htmlFor="degrees">
          Degree :
          <span>
            (if multiple degrees, then separate them by using commas):{" "}
          </span>
        </label>
        <input
          type="text"
          id="degrees"
          onChange={handleChange}
          value={data.degrees}
        />
        <br />
        <br />
        <label htmlFor="specialities">
          Speciality :{" "}
          <span>
            (if multiple specialities, then separate them by using commas):{" "}
          </span>
        </label>
        <input
          type="text"
          id="specialities"
          onChange={handleChange}
          value={data.specialities}
        />
        <br />
        <br />
        <label htmlFor="exp">Experience (in years) : </label>
        <input type="text" id="exp" value={data.exp} onChange={handleChange} />
        <br />
        <br />
        <button disabled={per !== null && per < 100} type="submit">
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default CreateDoctor;
