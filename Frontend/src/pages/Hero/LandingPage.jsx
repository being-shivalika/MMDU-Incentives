import Hero from "./Hero";
import Stats from "./Stats";
import Features from "./Features";
import Workflow from "./Workflow";

const LandingPage = () => {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      <Hero />
      <Stats />
      <Features />
      <Workflow />
    </main>
  );
};

export default LandingPage;
