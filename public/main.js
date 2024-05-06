const path = require("path");
const fs = require("fs");

const dirPath = path.join(__dirname, "../src/articles");
let articleList = [];

function trimArticle(str, maxChar = 700) {
  return str.length > maxChar ? str.substring(0, maxChar - 3) + "..." : str;
}

function removeMarkdown(str) {
  const markdownPatterns = [/\*\*(.*?)\*\*/g, /__(.*?)__/g, /\[(.*?)\]\((.*?)\)/g, /^#+\s(.*)/gm, /`(.*?)`/g, /\n={2,}/g];
  let cleanedStr = str;
  markdownPatterns.forEach((pattern) => {
    cleanedStr = cleanedStr.replace(pattern, "$1");
  });
  return cleanedStr;
}

function generatePath(str) {
  const removePunctuation = (str) => {
    const punctuationRegex = /[.,/#!$%^&*;:{}=\-_`~()'"]/g;
    return str.replace(punctuationRegex, "");
  };
  const addDashes = (str) => {
    return str.replace(/\s+/g, "-");
  };
  return addDashes(removePunctuation(str)).toLowerCase();
}

function getPosts() {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return console.log(`Failed to list contents of the directory: ${err}`);
    }

    let filesProcessed = 0;

    files.forEach((file, i) => {
      let obj = {};
      let post;
      fs.readFile(`${dirPath}/${file}`, "utf8", (err, contents) => {
        const getMetadataIndices = (acc, elem, i) => {
          if (/^---/.test(elem)) {
            acc.push(i);
          }
          return acc;
        };
        const parseMetadata = ({ lines, metadataIndices }) => {
          if (metadataIndices.length > 0) {
            let metadata = lines.slice(metadataIndices[0] + 1, metadataIndices[1]);
            metadata.forEach((line) => {
              obj[line.split(": ")[0]] = line.split(": ")[1];
            });
            return obj;
          }
        };
        const parseContent = ({ lines, metadataIndices }) => {
          if (metadataIndices.length > 0) {
            lines = lines.slice(metadataIndices[1] + 1, lines.length);
          }
          return lines.join("\n");
        };
        let lines = contents.split("\n");
        let metadataIndices = lines.reduce(getMetadataIndices, []);
        let metadata = parseMetadata({ lines, metadataIndices });
        let date = new Date(metadata.date);
        let timestamp = date.getTime() / 1000;
        let content = parseContent({ lines, metadataIndices });
        let preview = removeMarkdown(trimArticle(content));
        let path = generatePath(metadata.title);
        post = {
          id: timestamp,
          title: metadata.title ? metadata.title : "Title not specified",
          author: metadata.author ? metadata.author : "Author not specified",
          date: metadata.date ? metadata.date : "Date not specified",
          path: path,
          preview: preview ? preview : "Preview not specified",
          content: content ? content : "Content not specified",
        };

        articleList.push(post);

        filesProcessed++;

        if (filesProcessed === files.length - 1) {
          let sortedList = articleList.sort((a, b) => {
            return a.id < b.id ? 1 : -1;
          });
          let data = JSON.stringify(sortedList);
          fs.writeFileSync("src/articles/articles.json", data);
        }
      });
    });
  });
  return;
}

getPosts();
