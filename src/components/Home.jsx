import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="grid md:w-[80vw] sm:w-[90vw] w-full mx-auto md:gap-10 gap-5 grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 place-items-center md:p-20 sm:p-10 px-5 py-10">
      <span className="w-full font-work text-lg bg-primary text-accent px-6 py-8 rounded-lg text-center">
        <Link to="/create-service">
            Add new service
        </Link>
      </span>
      
      <span className="w-full font-work text-lg bg-primary text-accent px-6 py-8 rounded-lg text-center">
        <Link to="/create-doctor">
            Add new doctor
        </Link>
      </span>
      
      <span className="w-full font-work text-lg bg-primary text-accent px-6 py-8 rounded-lg text-center">
        <Link to="/manage-service">
            Manage Services
        </Link>
      </span>
      
      <span className="w-full font-work text-lg bg-primary text-accent px-6 py-8 rounded-lg text-center">
        <Link to="/manage-doctor">
            Manage Doctors
        </Link>
      </span>
      
    </div>
  );
};

export default Home;
