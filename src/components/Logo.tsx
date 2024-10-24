import Link from "next/link";
import { PiVinylRecordFill } from "react-icons/pi";

export default function Logo() {
  return (
    <h1 className="contents">
      <Link
        className="flex items-center gap-2.5 text-3xl font-black text-amber-400"
        href="/"
      >
        <PiVinylRecordFill className="group-hover:animate-spin transition-transform" /> Biscuit
      </Link>
    </h1>
  );
}
