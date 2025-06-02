import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AdvisorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to client detail page since we unified the models
    if (id) {
      navigate(`/clients/${id}`, { replace: true });
    } else {
      navigate("/advisors", { replace: true });
    }
  }, [id, navigate]);

  return null; // This component just redirects
};

export default AdvisorDetailPage;
