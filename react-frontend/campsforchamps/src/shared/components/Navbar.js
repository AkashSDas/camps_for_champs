import React, { Fragment, useContext, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated } from "../../helper/auth";
import { logout } from "../../helper/user";
import { UserContext } from "../hooks/UserContext";

// to give different style to different tabs
const currentTabHighlight = (history, path) => {
  if (history) {
    if (history.location.pathname === path) {
      return { color: "#498afb" };
    }
  }
};

// =============================
// 600px above navbar
// =============================
export const Navbar = withRouter(({ history, path }) => {
  const { userValues, setUserValues } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        {!isAuthenticated() ? (
          <Fragment>
            <BrandNavbarItem
              icon="fad fa-compass"
              text="home"
              to="/"
              history={history}
            />
            <ToggleTheme />
            <NavbarItem
              icon="fad fa-crown"
              text="plans"
              to="/camp-plan"
              history={history}
            />
            <NavbarItem
              icon="fad fa-store"
              text="products"
              to="/camp-product"
              history={history}
            />
            <NavbarItem
              icon="fad fa-images"
              text="gallery"
              to="/gallery"
              history={history}
            />
            <NavbarItem icon="fad fa-comment" text="blog" to="/post" />
            <NavbarItem
              icon="fad fa-user-plus"
              text="login"
              to="/login"
              history={history}
            />
          </Fragment>
        ) : (
          <Fragment>
            <BrandNavbarItem
              icon="fad fa-compass"
              text="home"
              to="/"
              history={history}
            />
            <ToggleTheme />
            <NavbarItem
              icon="fad fa-crown"
              text="plans"
              to="/camp-plan"
              history={history}
            />
            <NavbarItem
              icon="fad fa-store"
              text="products"
              to="/camp-product"
              history={history}
            />
            <NavbarItem
              icon="fad fa-images"
              text="gallery"
              to="/gallery"
              history={history}
            />
            <NavbarItem
              icon="fad fa-comment"
              text="blog"
              to="/post"
              history={history}
            />
            <NavbarItem
              icon="fad fa-shopping-cart"
              text="cart"
              to="/cart"
              history={history}
            />
            <NavbarItem
              icon="fad fa-cog"
              text="profile"
              to="/profile"
              history={history}
            />
            <NavbarItem
              icon="fad fa-user-minus"
              text="logout"
              to="/logout"
              history={history}
              onClick={() => {
                // removing values from user context
                setUserValues({
                  ...userValues,
                  userId: null,
                  username: null,
                  email: null,
                });

                logout(() => {
                  history.push("/");
                });
              }}
            />
          </Fragment>
        )}
      </ul>
    </nav>
  );
});

const NavbarItem = ({ icon, text, to, onClick = () => {}, history }) => {
  return (
    <li className="nav-item menu">
      <Link
        to={to}
        onClick={onClick}
        className="icon-button"
        style={currentTabHighlight(history, to)}
      >
        <i className={icon}></i>
        <span className="item-label tag tag-contrast tag-sm">{text}</span>
      </Link>
    </li>
  );
};

const BrandNavbarItem = ({ icon, text, to, onClick = () => {} }) => {
  return (
    <li className="nav-item">
      <Link to={to} onClick={onClick} className="icon-button brand-icon-button">
        <i className={icon}></i>
        {/* <span class="item-label tag tag-contrast tag-sm">{text}</span> */}
      </Link>
    </li>
  );
};

const ToggleTheme = () => {
  const theme = localStorage.getItem("theme");
  const bodyClass = document.body.classList;
  bodyClass.add(theme);
  let iconTheme = "fad fa-unicorn";
  if (theme === "ligth-theme") {
    iconTheme = "fad fa-moon-stars";
  } else if (theme === "dark-theme") {
    iconTheme = "fad fa-sun";
  }

  const [themeIcon, setThemeIcon] = useState(iconTheme);

  const toggleTheme = () => {
    const current = localStorage.getItem("theme");
    const next = current === "dark-theme" ? "light-theme" : "dark-theme";
    if (next === "dark-theme") {
      setThemeIcon("fad fa-sun");
    } else if (next === "light-theme") {
      setThemeIcon("fad fa-moon-stars");
    }
    bodyClass.replace(current, next);
    localStorage.setItem("theme", next);
  };

  return (
    <li id="themeButton" className="nav-item" onClick={toggleTheme}>
      <Link to="#" className="icon-button">
        <i className={themeIcon}></i>
        <span class="item-label tag tag-contrast tag-sm">theme</span>
      </Link>
    </li>
  );
};

// 600px and below navbar
export const NavbarAlt = withRouter(({ history, path }) => {
  const { userValues, setUserValues } = useContext(UserContext);
  const [displayNav, setDisplayNav] = useState(false);

  const toggleNavBarAlt = () => {
    console.log(displayNav);
    setDisplayNav(!displayNav);
  };

  return (
    <nav className="navbar-alt">
      <ul className="navbar-nav">
        {!isAuthenticated() ? (
          <Fragment>
            <BrandNavbarItemAlt
              icon="fad fa-compass"
              text="home"
              to="/"
              history={history}
            />
            <div className="extra-menu">
              <ToggleThemeAlt />
              <ToggleMenu onClick={toggleNavBarAlt} />
            </div>
            {displayNav ? (
              <div className="menu">
                <NavbarItemAlt
                  icon="fad fa-crown"
                  text="plans"
                  to="/camp-plan"
                  history={history}
                />
                <NavbarItemAlt
                  icon="fad fa-store"
                  text="products"
                  to="/camp-product"
                  history={history}
                />
                <NavbarItemAlt
                  icon="fad fa-images"
                  text="gallery"
                  to="/gallery"
                  history={history}
                />
                <NavbarItemAlt icon="fad fa-comment" text="blog" to="/post" />
                <NavbarItemAlt
                  icon="fad fa-user-plus"
                  text="login"
                  to="/login"
                  history={history}
                />
              </div>
            ) : null}
          </Fragment>
        ) : (
          <Fragment>
            <BrandNavbarItemAlt
              icon="fad fa-compass"
              text="home"
              to="/"
              history={history}
            />
            <div className="extra-menu">
              <ToggleThemeAlt />
              <ToggleMenu onClick={toggleNavBarAlt} />
            </div>
            {displayNav ? (
              <div className="menu">
                <NavbarItemAlt
                  icon="fad fa-crown"
                  text="plans"
                  to="/camp-plan"
                  history={history}
                />
                <NavbarItemAlt
                  icon="fad fa-store"
                  text="products"
                  to="/camp-product"
                  history={history}
                />
                <NavbarItemAlt
                  icon="fad fa-images"
                  text="gallery"
                  to="/gallery"
                  history={history}
                />
                <NavbarItemAlt
                  icon="fad fa-comment"
                  text="blog"
                  to="/post"
                  history={history}
                />
                <NavbarItemAlt
                  icon="fad fa-shopping-cart"
                  text="cart"
                  to="/cart"
                  history={history}
                />
                <NavbarItemAlt
                  icon="fad fa-cog"
                  text="profile"
                  to="/profile"
                  history={history}
                />
                <NavbarItemAlt
                  icon="fad fa-user-minus"
                  text="logout"
                  to="/logout"
                  history={history}
                  onClick={() => {
                    // removing values from user context
                    setUserValues({
                      ...userValues,
                      userId: null,
                      username: null,
                      email: null,
                    });

                    logout(() => {
                      history.push("/");
                    });
                  }}
                />
              </div>
            ) : null}
          </Fragment>
        )}
      </ul>
    </nav>
  );
});

const NavbarItemAlt = ({ icon, text, to, onClick = () => {}, history }) => {
  return (
    <li className="nav-item-alt">
      <Link
        to={to}
        onClick={onClick}
        className="icon-button-alt"
        style={currentTabHighlight(history, to)}
      >
        <i className={icon}></i> {text}
      </Link>
    </li>
  );
};

const BrandNavbarItemAlt = ({ icon, text, to, onClick = () => {} }) => {
  return (
    <li className=" brand-logo-alt">
      <Link to={to} onClick={onClick} className="icon-button brand-icon-button">
        <i className={icon}></i>
      </Link>
    </li>
  );
};

const ToggleThemeAlt = () => {
  const theme = localStorage.getItem("theme");
  const bodyClass = document.body.classList;
  bodyClass.add(theme);
  let iconTheme = "fad fa-unicorn";
  if (theme === "ligth-theme") {
    iconTheme = "fad fa-moon-stars";
  } else if (theme === "dark-theme") {
    iconTheme = "fad fa-sun";
  }

  const [themeIcon, setThemeIcon] = useState(iconTheme);

  const toggleTheme = () => {
    const current = localStorage.getItem("theme");
    const next = current === "dark-theme" ? "light-theme" : "dark-theme";
    if (next === "dark-theme") {
      setThemeIcon("fad fa-sun");
    } else if (next === "light-theme") {
      setThemeIcon("fad fa-moon-stars");
    }
    bodyClass.replace(current, next);
    localStorage.setItem("theme", next);
  };

  return (
    <li
      id="themeButton"
      className="nav-item-alt theme-icon"
      onClick={toggleTheme}
    >
      <Link to="#" className="icon-button-alt">
        <i className={themeIcon}></i>
      </Link>
    </li>
  );
};

const ToggleMenu = ({ onClick = () => {} }) => {
  return (
    <li className="toggle-menu-btn icon-button-alt" onClick={onClick}>
      <i className="fad fa-ellipsis-v-alt"></i>
    </li>
  );
};
