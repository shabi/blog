export const metadata = {
  title: "About Notes",

  description:
    "About Notes, a personal archive of thoughts, experiments, and discoveries about design, technology, and ideas.",

  openGraph: {
    title: "About Notes",

    description:
      "A personal archive of thoughts, experiments, and discoveries about design, technology, and ideas.",

    images: [
      {
        url: "/about/opengraph-image",
      },
    ],
  },
};


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
