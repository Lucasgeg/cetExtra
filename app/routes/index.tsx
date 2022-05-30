import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="text-6xl bg-slate-600 text-white">
      <h1>Hello world</h1>
      <Link to={"/login"}>
        {" "}
        <button>Toto</button>{" "}
      </Link>
    </div>
  );
}
