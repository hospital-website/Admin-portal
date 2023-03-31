import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Link to="/create-service">Add new service</Link>
      <br />
      <br />
      <Link to="/create-doctor">Add new doctor</Link>
      <br />
      <br />
      <Link to="/manage-service">Manage Services</Link>
      <br />
      <br />
      <Link to="/manage-doctor">Manage Doctors</Link>
      <br />
      <br />
    </div>
  );
};

export default Home;
