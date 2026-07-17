import { Fragment } from "react";
import Navbar from "../../components/Navigation/Navbar";
import Hero from "../../components/Home/Hero";
import Stats from "../../components/Home/Stats";
import Features from "../../components/Home/Features";
import Workflow from "../../components/Home/Workflow";

const HomePage = () => {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Stats />
        <Features />
        <Workflow />
        
      </main>
    </>
  );
};

export default HomePage;