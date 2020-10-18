import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../helper/profile";
import { getUserId, getUserInfo } from "../../helper/user";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { ProfileUpdateForm } from "./ProfileUpdateForm";
import { UserCoreInfoUpdateForm } from "./UserCoreInfoUpdateForm";

export const Profile = () => {
  const [user, setUser] = useState({ data: null });
  const [profile, setProfile] = useState({ data: null });

  // handle signup success, error, disable submit button
  const [response, setResponse] = useState({
    success: false,
    error: false,
    loading: true,
  });

  useEffect(() => {
    const userId = getUserId();
    setResponse({ ...response, loading: true });

    // getting user info
    getUserInfo(userId)
      .then((data) => {
        setUser({ data: data });
      })
      .then((_) => {
        // getting user profile
        getUserProfile(userId)
          .then((data) => {
            setProfile({ data: data });
            setResponse({ ...response, loading: false });
          })
          .catch((err) => {
            console.log(err);
            setResponse({ ...response, loading: false });
          });
      })
      .catch((err) => {
        console.log(err);
        setResponse({ ...response, loading: false });
      });

    return () => {
      setResponse({ ...response, loading: false });
    };
  }, []);

  const [display, setDisplay] = useState({
    userCoreInfo: true,
    userCoreInfoUpdateForm: false,
    changePasswordForm: false,
    profileUpdateForm: false,
  });

  const getGenderValue = (num) => {
    switch (num) {
      case 0:
        return "Male";
      case 1:
        return "Female";
      case 2:
        return "Transgender";
      default:
        return "Don't want to answer";
    }
  };

  const userInfo = () => {
    if (!response.loading && display.userCoreInfo) {
      return (
        <div className="profile">
          <h1>Your profile</h1>

          <section className="user-core-info">
            <h3>
              <i className="fas fa-user-crown"></i> Username:
              <span>{user.data.username}</span>
            </h3>
            <h3>
              <i className="fas fa-envelope"></i> Email:
              <span>{user.data.email}</span>
            </h3>

            <hr />

            <div className="personal-info">
              <div className="info">
                <h4>
                  <i className="fas fa-spider"></i> Firstname
                </h4>
                <div className="value">
                  {profile.data.first_name
                    ? profile.data.first_name
                    : "Not set"}
                </div>
              </div>

              <div className="info">
                <h4>
                  <i class="fas fa-deer-rudolph"></i> Lastname
                </h4>
                <div className="value">
                  {profile.data.last_name ? profile.data.last_name : "Not set"}
                </div>
              </div>

              <div className="info">
                <h4>
                  <i class="fas fa-rabbit-fast"></i> Phone number
                </h4>
                <div className="value">
                  {profile.data.phone_number
                    ? profile.data.phone_number
                    : "Not set"}
                </div>
              </div>

              <div className="info">
                <h4>
                  <i class="fas fa-alicorn"></i> Gender
                </h4>
                <div className="value">
                  {profile.data.gender
                    ? getGenderValue(profile.data.gender)
                    : "Don't want to answer"}
                </div>
              </div>

              <div className="info">
                <h4>
                  <i class="fas fa-whale"></i> Address
                </h4>
                <div className="value">
                  {profile.data.address ? profile.data.address : "Not set"}
                </div>
              </div>
            </div>

            <hr />

            {buttonSection()}
          </section>
        </div>
      );
    }
  };

  const buttonSection = () => {
    return (
      <section className="btn-section">
        <button
          onClick={() =>
            setDisplay({
              ...display,
              userCoreInfo: false,
              userCoreInfoUpdateForm: true,
            })
          }
        >
          <i className="fas fa-squirrel"></i> Update username/email
        </button>

        <button
          onClick={() =>
            setDisplay({
              ...display,
              userCoreInfo: false,
              profileUpdateForm: true,
            })
          }
        >
          <i className="fas fa-monkey"></i> Update personal info
        </button>

        <button
          onClick={() =>
            setDisplay({
              ...display,
              userCoreInfo: false,
              changePasswordForm: true,
            })
          }
        >
          <i className="fas fa-elephant"></i> Change Password
        </button>
      </section>
    );
  };

  const showUpdateForm = () => {
    if (display.userCoreInfoUpdateForm) {
      return (
        <UserCoreInfoUpdateForm
          display={display}
          setDisplay={setDisplay}
          user={user}
          setUser={setUser}
        />
      );
    } else if (display.changePasswordForm) {
      return <ChangePasswordForm display={display} setDisplay={setDisplay} />;
    } else if (display.profileUpdateForm) {
      return (
        <ProfileUpdateForm
          display={display}
          setDisplay={setDisplay}
          profile={profile.data}
        />
      );
    }
  };

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="profile-container">
        {response.loading ? (
          <div className="loader"></div>
        ) : (
          <div>
            {userInfo()}

            {showUpdateForm()}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
