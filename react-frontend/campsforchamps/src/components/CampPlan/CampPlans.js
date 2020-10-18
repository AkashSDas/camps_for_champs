import React, { useEffect, useState } from "react";
import { getAllPlans } from "../../helper/campPlan";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { CampPlanCard } from "./CampPlanCard";

export const CampPlans = () => {
  const [campPlans, setCampPlans] = useState([]);

  // handle signup success, error, disable submit button
  const [response, setResponse] = useState({
    loading: false,
  });

  useEffect(() => {
    setResponse({ ...response, loading: true });

    getAllPlans()
      .then((data) => {
        setCampPlans(data);
        setResponse({ ...response, loading: false });
      })
      .catch((err) => {
        console.log(err);
        setResponse({ ...response, loading: false });
      });
  }, []);

  const campPlansJsx = (campPlans) => (
    <section className="camp-plan">
      <h1>Camp plans</h1>

      {response.loading ? (
        <div className="loader"></div>
      ) : (
        <div>
          {campPlans.length !== 0 ? (
            <div className="plan-grid">
              {campPlans.map((plan, i) => (
                <CampPlanCard key={i} plan={plan} />
              ))}
            </div>
          ) : (
            <h3>
              <i className="fas fa-frown"></i> No camp plans
            </h3>
          )}
        </div>
      )}
    </section>
  );

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      {campPlansJsx(campPlans)}

      <Footer />
    </div>
  );
};
