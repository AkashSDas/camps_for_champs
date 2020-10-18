import React, { useEffect, useState } from "react";
import { getAllPlans } from "../../helper/campPlan";
import { CampPlanCardHome } from "./CampPlanCardHome";

export const CampPlansHome = () => {
  const [campPlans, setCampPlans] = useState([]);

  // handle signup success, error, disable submit button
  const [response, setResponse] = useState({
    loading: false,
  });

  useEffect(() => {
    setResponse({ ...response, loading: true });

    getAllPlans()
      .then((data) => {
        // setting only 4 plans
        setCampPlans(data.slice(0, 4));
        setResponse({ ...response, loading: false });
      })
      .catch((err) => {
        console.log(err);
        setResponse({ ...response, loading: false });
      });
  }, []);

  const campPlansJsx = (campPlans) => (
    <section className="home-camp-plan">
      {response.loading ? (
        <div className="loader"></div>
      ) : (
        <div>
          {campPlans.length !== 0 ? (
            <div className="plan-grid">
              {campPlans.map((plan, i) => (
                <CampPlanCardHome key={i} plan={plan} />
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

  return <div>{campPlansJsx(campPlans)}</div>;
};
