import { NotFoundRedirect } from "./components/not-found-redirect";

export default function NotFound() {
  return (
    <>
      <NotFoundRedirect />
    <main
      className="
        flex
        min-h-screen
        items-start
        justify-center
        pt-[35vh]
        px-6
        text-center
      "
    >
      <h1
        className="
          text-2xl
          font-normal
          tracking-[0.12em]
          text-neutral-700
          dark:text-neutral-300
        "
      >
        「&nbsp;&nbsp;There&nbsp;&nbsp;is&nbsp;&nbsp;no&nbsp;&nbsp;spoon .&nbsp;&nbsp;」
      </h1>
    </main>
    </>
  );
}
