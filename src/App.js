import "./App.css";
import NavBar from "./components/NavBar"

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext";
import CreateDoctor from "./components/CreateDoctor";
import CreateService from "./components/CreateService";
import Home from "./components/Home";
import Login from "./components/Login";
import ManageDoctor from "./components/ManageDoctor";
import ManageService from "./components/ManageService";
import UpdateDoctor from "./components/UpdateDoctor";
import UpdateService from "./components/UpdateService";
import { useContext } from "react";
import Footer from "./components/Footer";

const App = () => {
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <>
    <Router>
      <NavBar />
        <Routes>
          <Route path="/">
            <Route path="/login" element={<Login />} />
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="/create-service">
              <Route
                index
                element={
                  <RequireAuth>
                    <CreateService />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="/create-doctor">
              <Route
                index
                element={
                  <RequireAuth>
                    <CreateDoctor />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="/manage-service">
              <Route
                index
                element={
                  <RequireAuth>
                    <ManageService />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="/manage-doctor">
              <Route
                index
                element={
                  <RequireAuth>
                    <ManageDoctor />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="/update-service/:id">
              <Route
                index
                element={
                  <RequireAuth>
                    <UpdateService />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="/update-doctor/:id">
              <Route
                index
                element={
                  <RequireAuth>
                    <UpdateDoctor />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
        </Routes>
      </Router>

      <Footer />
    </>
  );
};

export default App;
