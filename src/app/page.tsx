import { CaseSwapper, SearchForm } from "@/components";

export default function Home() {
  return (
    <main className="from-slate-100 to-slate-300 bg-gradient-to-br p-24 flex flex-col gap-10">
      <div className="flex items-center justify-center flex-col">
        <div className="flex flex-row gap-4 justify-center items-center text-4xl">
          <span>🤬</span>
          <span>🍆</span>
          <span>🔫</span>
          <span>👻</span>
        </div>

        <CaseSwapper
          className="font-bold text-4xl md:text-5xl lg:text-7xl text-red-700"
          tag="h1"
          text="IMDB Parental Guide Checker"
          timeout={400}
        />
      </div>

      <div className="flex min-h-screen flex-col items-center max-w-4xl mx-auto text-center ">
        <div className="flex flex-col gap-12">
          <h2 className="font-bold text-3xl md:text-4xl max-w-lg mx-auto leading-loose">
            enter a <span className="bg-pink-400 px-1">movie or series</span> name, and get a list of the{" "}
            <span className="bg-blue-700 text-white px-1">parental guides</span> from{" "}
            <span className="bg-yellow-400 px-1">imdb</span>.
          </h2>

          <SearchForm />
        </div>
      </div>
    </main>
  );
}
