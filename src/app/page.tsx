"use client";
import { Search } from "lucide-react";
import MapComponent from "./components/Map";

const Home = () => {
  return (
    <div className="relative">
      <div className="flex absolute w-full items-center h-[60px] z-10 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="gap-3 w-[100vw] flex justify-center">
            <div className="flex relative max-w-[40%] w-full">
              <input
                type="text"
                placeholder="Busque por localização..."
                className="text-black w-full pl-5 pr-5 py-2 rounded-2xl focus:ring-2"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 ">
                <Search className=" h-[25px] w-[25px] text-black" />
              </div>
            </div>
            <button className=" bg-black text-white px-6 py-2 rounded-2xl hover:bg-gray-600 transition duration-300">
              Buscar
            </button>
          </div>
        </div>
      </div>
      <nav className="bg-navColor bg-opacity-90 blur-backdrop-filter shadow-lg h-[60px] p-4"></nav>
      <MapComponent />
    </div>
  );
};

export default Home;
