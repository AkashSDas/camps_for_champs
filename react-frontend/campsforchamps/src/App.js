import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CampPlanInfo } from "./components/CampPlan/CampPlanInfo";
import { CampPlans } from "./components/CampPlan/CampPlans";
import { CampProductInfo } from "./components/CampProduct/CampProductInfo";
import { CampProducts } from "./components/CampProduct/CampProducts";
import { Cart } from "./components/Cart/Cart";
import { AboutUs } from "./components/Home/AboutUs";
import { ContactUs } from "./components/Home/ContactUs";
import { Gallery } from "./components/Home/Gallery";
import { Home } from "./components/Home/Home";
import { Post } from "./components/Post/Post";
import { PostCreateForm } from "./components/Post/PostCreateForm";
import { PostInfo } from "./components/Post/PostInfo";
import { PostUpdateForm } from "./components/Post/PostUpdateForm";
import { Profile } from "./components/Profile/Profile";
import { ForgotPassword } from "./components/User/ForgotPassword";
import { ForgotPasswordConfirm } from "./components/User/ForgotPasswordConfirm";
import { LogIn } from "./components/User/LogIn";
import { SignUp } from "./components/User/SignUp";
import "./design/style.scss";
import { PrivateRoutes } from "./shared/components/PrivateRoutes";
import { UserContext } from "./shared/hooks/UserContext";

const App = () => {
  // user data (userId, username, email)
  const initialState = { userId: null, username: null, email: null };
  const [userValues, setUserValues] = React.useState(initialState);
  const userProviderValue = { userValues, setUserValues };

  return (
    <main>
      <Router>
        <Switch>
          <UserContext.Provider value={userProviderValue}>
            <Route path="/" exact component={Home} />
            <Route path="/gallery" exact component={Gallery} />
            <Route path="/about-us" exact component={AboutUs} />
            <Route path="/contact-us" exact component={ContactUs} />

            <Route path="/signup" exact component={SignUp} />
            <Route path="/login" exact component={LogIn} />
            <Route path="/password-reset" exact component={ForgotPassword} />
            <Route
              path="/password-reset/confirm"
              exact
              component={ForgotPasswordConfirm}
            />

            <Route path="/camp-plan" exact component={CampPlans} />
            <Route path="/camp-plan/:name" exact component={CampPlanInfo} />

            <Route path="/camp-product" exact component={CampProducts} />
            <Route
              path="/camp-product/:name"
              exact
              component={CampProductInfo}
            />

            <Route path="/post" exact component={Post} />
            <Route path="/post/info" exact component={PostInfo} />
            <PrivateRoutes
              path="/post/create"
              exact
              component={PostCreateForm}
            />
            <PrivateRoutes
              path="/post/update"
              exact
              component={PostUpdateForm}
            />

            <PrivateRoutes path="/profile" exact component={Profile} />
            <PrivateRoutes path="/cart" exact component={Cart} />
          </UserContext.Provider>
        </Switch>
      </Router>
    </main>
  );
};

export default App;
