export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <article
      className="
        mx-auto
        max-w-[720px]

        px-4
        md:px-0

        text-gray-800
        md:text-gray-900

        dark:text-gray-300
        md:dark:text-gray-200

        mb-10

        text-[18px]

        leading-[1.75]
      "
    >

      {children}

    </article>

  );

}