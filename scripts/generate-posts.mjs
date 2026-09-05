import fs from "fs";
import path from "path";
import matter from "gray-matter";


const POSTS_DIR = "./posts";


const GITHUB_OWNER = "shabi";
const GITHUB_REPO = "blog";
const GITHUB_BRANCH = "dynamic-id";


async function getLastModifiedDate(filePath) {

  const url =
  `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits` +
  `?path=${encodeURIComponent(filePath)}` +
  `&sha=${GITHUB_BRANCH}` +
  `&per_page=1`;


  try {

    const response =
      await fetch(url, {
        headers: {
          Accept:
            "application/vnd.github+json",

          "X-GitHub-Api-Version":
            "2022-11-28",

          "User-Agent":
            "ohhoba-blog",
        },
      });


    if (!response.ok) {

      throw new Error(
        `GitHub API returned ${response.status}`
      );

    }


    const commits =
      await response.json();


    if (
      !Array.isArray(commits) ||
      commits.length === 0
    ) {

      return null;

    }


    return (
      commits[0]?.commit?.author?.date ??
      null
    );


  } catch (error) {

    console.error(
      `Failed to read GitHub history for ${filePath}:`,
      error
    );


    return null;

  }

}




function getPostFiles() {

  if (!fs.existsSync(POSTS_DIR)) {

    throw new Error(
      `Posts directory not found: ${POSTS_DIR}`
    );

  }


  return fs
    .readdirSync(
      POSTS_DIR,
      {
        withFileTypes: true,
      }
    )
    .filter(
      entry =>
        entry.isFile() &&
        entry.name.endsWith(".mdx")
    )
    .map(
      entry =>
        entry.name.replace(
          /\.mdx$/,
          ""
        )
    );

}




async function createPost(id) {


  const filePath =
    path.join(
      POSTS_DIR,
      `${id}.mdx`
    );



  const source =
    fs.readFileSync(
      filePath,
      "utf8"
    );



  const parsed =
    matter(source);



  const frontmatter =
    parsed.data;



  if (!frontmatter.title) {

    throw new Error(
      `${filePath} is missing "title"`
    );

  }



  if (!frontmatter.date) {

    throw new Error(
      `${filePath} is missing "date"`
    );

  }



  if (!frontmatter.lang) {

    throw new Error(
      `${filePath} is missing "lang"`
    );

  }



  if (!frontmatter.category) {

    throw new Error(
      `${filePath} is missing "category"`
    );

  }



  const githubPath =
    `posts/${id}.mdx`;



  const updatedAt =
    await getLastModifiedDate(
      githubPath
    );



  return {

    id,


    date:
      frontmatter.date,


    title:
      frontmatter.title,


    description:
      frontmatter.description ?? "",


    image:
      frontmatter.image ??
      "/opengraph-image",


    tags:
      Array.isArray(frontmatter.tags)
        ? frontmatter.tags
        : [],


    lang:
      frontmatter.lang,


    category:
      frontmatter.category,



    updatedAt:
      updatedAt ||
      frontmatter.date,

  };

}




const postIds =
  getPostFiles();



console.log(
  `Found ${postIds.length} post(s)`
);



const posts =
  await Promise.all(
    postIds.map(createPost)
  );



posts.sort(
  (a, b) =>
    new Date(b.date).getTime() -
    new Date(a.date).getTime()
);



const data = {
  posts,
};



fs.writeFileSync(
  "./app/posts.generated.json",
  JSON.stringify(
    data,
    null,
    2
  )
);



console.log(
  "posts.generated.json created"
);