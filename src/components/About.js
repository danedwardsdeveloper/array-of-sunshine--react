import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import Header from "./Header";
// import articles from "../articles/articles.json";
import SideBar from "./SideBar";
// import Footer from "./Footer";

function About() {
  const tags = ["Book reviews", "JavaScript", "React"];

  useEffect(() => {
    document.title = "About | Array of Sunshine | Front-End WebDev Blog: JavaScript, React, Coding book Reviews";
  }, []);

  // useDispatch

  return (
    <>
      <main className="main--article">
        <div className="col">
          <article className="full-article">
            <h1 className="article-title--full">About</h1>
            <p>
              Array of Sunshine is a blog about front-end web development, with practical JavaScript & React tutorials, and in-depth coding book reviews. Currently also contains AI articles by Google Gemini, and some sonnets by Shakespeare, just to
              demonstrate writer and tags collections and pagination features. Created by Dan Edwards.
            </p>
            <p>Dan is a front-end web developer based in Bolton, UK. Currently training to full-stack with Codecademy.</p>
          </article>
        </div>

        <SideBar />
      </main>
    </>
  );
}

export default About;