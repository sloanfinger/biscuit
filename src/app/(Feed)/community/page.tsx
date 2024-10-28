import { PiCaretDownBold, PiMagnifyingGlassBold } from "react-icons/pi";

export default function Community() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-3 px-4 pb-3 text-white *:rounded-lg *:bg-zinc-900">
      <form className="flex flex-col gap-4 px-24 pb-8 pt-32">
        <h2 className="font-serif text-7xl">Community</h2>

        <label className="relative block">
          <input
            className="peer w-full rounded-md border-2 border-zinc-700 bg-transparent py-4 pl-[3.25rem] text-xl placeholder:text-zinc-500 focus:border-green-600 focus:outline-none"
            placeholder="Genres, Vibes, Must-Listens..."
            type="text"
            name="search"
          />
          <span className="absolute left-0 top-0 flex h-full items-center pl-5 pr-4 text-xl text-zinc-400 peer-focus:text-green-600">
            <PiMagnifyingGlassBold />
          </span>
        </label>

        <button
          className="-mt-2 flex items-center gap-2 self-end rounded-md px-3 py-1 text-amber-400/80 transition-colors hover:bg-amber-500/10"
          type="button"
        >
          Advanced Filters <PiCaretDownBold />
        </button>
      </form>
    </main>
  );
}
