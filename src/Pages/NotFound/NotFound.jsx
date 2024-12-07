import { useNavigate } from "react-router-dom";
import "./globals.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleRedir = () => {
    navigate("/");
  };

  return (
    <div className="main-section">
      <div className="btn-area">
        <button className="slide-btn" onClick={handleRedir}>Go Back</button>
      </div>
      <div className="err-body">
        <h1 className="err-text">404</h1>
        <p className="err-sub">
          We couldn&apos;t find the page you were looking for.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
