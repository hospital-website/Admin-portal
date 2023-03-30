import "./App.css";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext";
import Home from "./components/Home";
import Login from "./components/Login";
import { useContext } from "react";

const App = () => {
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <Router>
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
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
