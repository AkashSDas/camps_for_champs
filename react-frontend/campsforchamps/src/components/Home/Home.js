import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { CampPlansHome } from "./CampPlansHome";
import { CampProductsHome } from "./CampProductsHome";

export const Home = () => {
  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="home">
        <div className="intro">
          <div className="vision">
            <h1>CampsForChamps</h1>

            <p>
              CampsForChamps offers the best travelling experience to students,
              families and travellers around the world through its professional
              staff, high security and sense of adventure.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"
            alt="campsforchamps"
          />
        </div>

        <hr />

        <div>
          <h3>
            <i className="fad fa-map-marked-alt"></i> Plans
          </h3>

          <div className="home-plan-container">
            <CampPlansHome />
            <Link className="more-plan-btn" to="/camp-plan">
              <i className="fas fa-rocket"></i> More plans
            </Link>
          </div>
        </div>

        <hr />

        <div>
          <h3>
            <i className="fad fa-flashlight"></i> Products
          </h3>

          <div className="home-product-container">
            <CampProductsHome />
            <Link className="more-product-btn" to="/camp-product">
              <i className="fas fa-rocket"></i> More products
            </Link>
          </div>
        </div>

        <hr />

        <div className="customer-review">
          <h3>
            <i className="fad fa-rocket"></i> Customer reviews
          </h3>

          <div className="reviews">
            <div className="review-card">
              <img
                src="https://images.unsplash.com/photo-1546820389-44d77e1f3b31?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
                alt="review1"
              />
              <div className="ratings">
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
              </div>
              <div className="review">
                Amazing services by CampsForChamps, beautiful places and amazing
                people.
              </div>
            </div>

            <div className="review-card">
              <img
                src="https://images.unsplash.com/photo-1493106819501-66d381c466f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
                alt="review2"
              />
              <div className="ratings">
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
              </div>
              <div className="review">
                Amazing services by CampsForChamps, beautiful places and amazing
                people.
              </div>
            </div>

            <div className="review-card">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1534&q=80"
                alt="review3"
              />
              <div className="ratings">
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
                <i className="fad fa-star"></i>
              </div>
              <div className="review">
                Amazing services by CampsForChamps, beautiful places and amazing
                people.
              </div>
            </div>
          </div>

          <div className="move-arrows">
            <i className="fas fa-arrow-left"></i>
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
