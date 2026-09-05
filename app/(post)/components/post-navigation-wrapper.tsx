import { PostNavigation } from "./post-navigation";


export function PostNavigationWrapper({
  id,
  from,
}: {
  id: string;
  from: string;
}) {

  return (
    <PostNavigation
      id={id}
      from={from}
    />
  );

}