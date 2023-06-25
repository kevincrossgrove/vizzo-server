import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="py-16 flex flex-col justify-between items-center h-screen">
      <div>
        <h1 className="text-center text-3xl font-bold tracking-wider mb-4">
          Vizzo
        </h1>
        <p className="text-center text-xl">Making clout contagious</p>
      </div>
      <div className="flex justify-evenly w-80">
        <Link to="/login">
          <button className="bg-accent px-8 py-2 rounded-md font-bold">
            Log in
          </button>
        </Link>
        <Link to="/signup">
          <button className="bg-primary px-8 py-2 rounded-md font-bold ">
            Sign up
          </button>
        </Link>
      </div>
    </main>
  );
}
