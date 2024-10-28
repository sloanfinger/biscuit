import Image from "next/image";
import Link from "next/link";
import { PiArrowRightBold } from "react-icons/pi";
import hero from "./hero.jpg";

export default function Home() {
  return (
    <>
      <header className="relative z-0 mx-auto -mt-[5.75rem] flex h-[100dvh] w-full max-w-[1600px] flex-col">
        <div className="relative flex-grow">
          <Image
            alt=""
            className="absolute top-0 size-full object-cover brightness-75"
            src={hero}
          />

          <div className="absolute inset-0 size-full bg-gradient-to-b from-zinc-950/80 to-zinc-950/20" />
        </div>

        <div className="z-0 mx-auto -mt-[3.75rem] flex w-full max-w-5xl flex-col items-center gap-14 pb-16">
          <p className="text-center font-serif text-[5rem] font-bold text-amber-400">
            Recommendations By People, Not AI.
          </p>

          <p className="-mt-12 max-w-prose text-2xl text-amber-200">
            Join the free social network made by music enthusiasts, for music
            enthusaists.
          </p>

          <Link
            href="/onboarding"
            className="flex items-center gap-2 rounded-md border-2 border-orange-800 bg-gradient-to-b from-orange-400 to-orange-500 px-10 py-3 text-xl text-orange-950"
          >
            Get Started
            <PiArrowRightBold />
          </Link>
        </div>
      </header>

      <main></main>

      <footer></footer>
    </>
  );
}
