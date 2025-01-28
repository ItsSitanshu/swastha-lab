import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-800">
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <img alt="" className="w-10 h-10" src="/logo.svg" />
          <span className="text-xl font-bold">Swastha Lab</span>
        </div>
        <nav className="space-x-6">
          <a className="text-gray-600 hover:text-gray-800" href="#">
            Home
          </a>
          <a className="text-gray-600 hover:text-gray-800" href="#">
            About Us
          </a>
          <a className="text-gray-600 hover:text-gray-800" href="#">
            Contact
          </a>
        </nav>
        <div className="space-x-4">
          <a
            className="px-4 py-2 bg-mod text-white rounded-full hover:bg-dark transition-all ease-in-out duration-500"
            href=""
          >
            Log in
          </a>
        </div>
      </header>
      <main className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Lorem ipsum dolor sit.
          <span className="text-mod"> lorem </span>
          and
          <span className="text-brown"> ipsum </span>
          dolor sit.
        </h1>
        <p className="text-gray-600 mb-8">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
          aspernatur repellendus eum aperiam. Officia, temporibus!
        </p>
        <a
          className="px-6 py-3 bg-mod text-white rounded-full hover:bg-dark transition-all ease-in-out duration-500"
          href="#"
        >
          Get started
        </a>
        <div className="mt-8 flex justify-center space-x-4">
          <img alt="lorem " className="w-24 h-24 rounded-full" src="" />
          <img alt="ipsum" className="w-24 h-24 rounded-full" src="" />
        </div>
      </main>
      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-3xl font-bold mb-8">
          Our
          <span className="text-mod font-pacifico"> interactive </span>
          features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#f4d4d4] p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-2">
              Fun
              <span className="text-mod"> lorem </span>
            </h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam!
            </p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-2">
              Creative
              <span className="text-mod"> Activities </span>
            </h3>
            <p>
              Discover enjoyable activities such as coloring, crafting, and
              science.
            </p>
          </div>
          <div className="bg-[#e0e0e0] p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-2">
              Learn with
              <span className="text-mod"> Games </span>
            </h3>
            <p className="text-gray-800">
              Learn something new while your kids are playing games!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
