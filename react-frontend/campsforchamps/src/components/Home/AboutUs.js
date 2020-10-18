import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";

export const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="about-us">
        <h1>About Us</h1>

        <div className="content">
          <div className="normal-order">
            <p>
              This is a non commercial open source project built using Django
              for backend and React and SaaS for frontend with Strip and
              Braintree payment gateways. Everything in this project is
              hypothetical.
            </p>
            <img
              src="https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
              alt="camp1"
            />
          </div>
          <div className="reverse-order">
            <p>
              Camps for champs is camps for champs like you. We organise camp
              plans which are divided into Basic, Standard and Premium. We also
              have a shopping section where you can buy camping accessories like
              bag, tent, camera, etc...
            </p>
            <img
              src="https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
              alt="camp2"
            />
          </div>
          <div className="normal-order">
            <p>
              CampsForChamps is been providing world class services since
              100years. The story start from 1920 when the founder of the
              company Mr. Alexander Edward Da'Silva who was adventurous by
              nature had started the company with just $1000, which he loaned
              from his mother. Today we attained great success in the business.
              The delightfulness in our customers face is our mission. So{" "}
              <em>where's your sense of adventure?</em>{" "}
              <Link to="/signup">Join us</Link> today and join us in our
              adventure.
            </p>
            <img
              src="https://images.unsplash.com/photo-1524494860062-9442631ee30e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80"
              alt="camp3"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
