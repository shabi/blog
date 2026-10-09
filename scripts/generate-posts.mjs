import { createHash } from "node:crypto";
import fs from "fs";
import path from "path";
import matter from "gray-matter";


const POSTS_DIR = "./posts";

const GITHUB_OWNER = "shabi";
const GITHUB_REPO = "blog";
const GITHUB_BRANCH = "master";

const POST_DATES_FILE = "./app/post-dates.json";
let postDateRecords = {};

if (fs.existsSync(POST_DATES_FILE)) {
  postDateRecords = JSON.parse(
    fs.readFileSync(POST_DATES_FILE, "utf8")
  );
}



async function getCommitDates(filePath) {
  const baseUrl =
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits`;

  let page = 1;
  let latest = null;
  let earliest = null;
  let history = [];

  try {

    while (true) {

      const url =
        `${baseUrl}` +
        `?path=${encodeURIComponent(filePath)}` +
        `&sha=${GITHUB_BRANCH}` +
        `&per_page=100` +
        `&page=${page}`;


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
        return {
          first: null,
          latest: null,
        };
      }


      const commits =
        await response.json();

      history.push(
        ...commits.map((commit) => ({
          hash: commit.sha?.slice(0, 7) ?? "",
          date:
            commit.commit?.author?.date ??
            commit.commit?.committer?.date ??
            null,
          message:
            commit.commit?.message ?? "",
        }))
      );


      if (
        !Array.isArray(commits) ||
        commits.length === 0
      ) {
        break;
      }


      if (!latest) {
        latest =
          commits[0]?.commit?.author?.date ??
          commits[0]?.commit?.committer?.date ??
          null;
      }


      const lastCommit =
        commits[commits.length - 1];


      earliest =
        lastCommit?.commit?.author?.date ??
        lastCommit?.commit?.committer?.date ??
        earliest;


      if (commits.length < 100) {
        break;
      }


      page++;
    }


    return {
      first: earliest,
      latest,
      history,
    };


  } catch (error) {

    console.error(
      `Failed to read GitHub history for ${filePath}:`,
      error
    );


    return {
      first: null,
      latest: null,
    };

  }
}



function getPostFiles(dir = POSTS_DIR) {

  const files = [];


  const entries =
    fs.readdirSync(
      dir,
      {
        withFileTypes: true,
      }
    );


  for (const entry of entries) {

    const fullPath =
      path.join(
        dir,
        entry.name
      );


    if (entry.isDirectory()) {

      files.push(
        ...getPostFiles(fullPath)
      );

    }


    if (
      entry.isFile() &&
      entry.name.endsWith(".mdx")
    ) {

      files.push(fullPath);

    }

  }


  return files;

}



function getMetaFromPath(filePath) {

  const relative =
    path.relative(
      POSTS_DIR,
      filePath
    );


  const parts =
    relative.split(path.sep);


  if (parts.length !== 3) {

    throw new Error(
      `Invalid post path: ${relative}`
    );

  }


  return {
    lang: parts[0],
    category: parts[1],
    id: parts[2].replace(
      /\.mdx$/,
      ""
    ),
  };

}



function getDescription(content) {
  return content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[\s\S]*?\}/g, " ")
    .replace(/[#>*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}



async function createPost(filePath) {

  const {
    lang,
    category,
    id,
  } =
    getMetaFromPath(filePath);


  const source =
    fs.readFileSync(
      filePath,
      "utf8"
    );


  const contentHash = createHash("sha256")
    .update(source)
    .digest("hex");

  const parsed =
    matter(source);


  if (!parsed.data.title) {

    throw new Error(
      `${filePath} missing title`
    );

  }


  const githubPath =
    filePath
      .replace(
        /^\.\/+/,
        ""
      )
      .replaceAll(
        "\\",
        "/"
      );


  const {
    first,
    latest,
    history,
  } =
    await getCommitDates(
      githubPath
    );


  const stat =
    fs.statSync(filePath);


  const fileDate =
    stat.birthtime?.toISOString() ??
    stat.mtime?.toISOString() ??
    new Date().toISOString();


  const previousDateRecord = postDateRecords[githubPath];

  const date =
    previousDateRecord?.date ??
    first ??
    parsed.data.date ??
    fileDate;

  let updatedAt;

  if (
    previousDateRecord?.contentHash === contentHash &&
    previousDateRecord.updatedAt
  ) {
    // 文章内容没变：保留之前的更新时间
    updatedAt = previousDateRecord.updatedAt;
  } else if (previousDateRecord?.contentHash) {
    // 文章内容变化：只更新这篇文章的时间
    updatedAt = new Date().toISOString();
  } else {
    // 首次记录：使用可用的历史日期
    updatedAt =
      latest ??
      parsed.data.updatedAt ??
      stat.mtime?.toISOString() ??
      date;
  }

  postDateRecords[githubPath] = {
    contentHash,
    date,
    updatedAt,
  };


  return {

    id,

    title:
      parsed.data.title,

    description:
      parsed.data.description ??
      getDescription(parsed.content),

    image:
      parsed.data.image ??
      "/opengraph-image",

    tags:
      Array.isArray(parsed.data.tags)
        ? parsed.data.tags
        : [],

    lang,

    category,

    filePath:
      githubPath,

    date,

    updatedAt,

    history,

  };

}



const files =
  getPostFiles();


console.log(
  `Found ${files.length} post(s)`
);


const posts =
  await Promise.all(
    files.map(createPost)
  );


posts.sort((a, b) => {
  if (a.id === "welcome" && b.id !== "welcome") return 1;
  if (b.id === "welcome" && a.id !== "welcome") return -1;

  const updatedDiff =
    new Date(b.updatedAt).getTime() -
    new Date(a.updatedAt).getTime();

  if (updatedDiff !== 0) return updatedDiff;

  return new Date(b.date).getTime() - new Date(a.date).getTime();
});


fs.writeFileSync(
  POST_DATES_FILE,
  JSON.stringify(postDateRecords, null, 2) + "\n"
);

fs.writeFileSync(
  "./app/posts.generated.json",
  JSON.stringify(
    {
      posts,
    },
    null,
    2
  )
);


console.log(
  "posts.generated.json created"
);
