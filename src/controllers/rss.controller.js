// import { Article } from "../model/articel.model.js";
// import { escape } from "html-escaper"; 
// export const  getRssFeedController =   async (req, res) => {
//   try {
//     const articles = await Article.find({ published_at_datetime: { $ne: null }, })
//       .sort({ published_at_datetime: -1 })
//       .limit(10);

//     const rssItems = articles
//       .map((article) => `
//         <item>
//           <title>${escape(article.title)}</title>
//           <link>${process.env.WEB_LINK}/articles/${article.slug}</link>
//           <description>${escape(article.summary || "")}</description>
//           <pubDate>${new Date(article.published_at_datetime).toUTCString()}</pubDate>
//           <category>${article.primary_category?.name || "General"}</category>
//           <guid isPermaLink="true">${process.env.WEB_LINK}/articles/${article.slug}</guid>
//         </item>
//       `)
//       .join("");

//     const rssFeed = `
//       <rss version="2.0">
//         <channel>
//           <title>SportPoing News</title>
//           <link>${process.env.WEB_LINK}</link>
//           <description>Latest articles from SportPoing</description>
//           ${rssItems}
//         </channel>
//       </rss>
//     `;

//     res.set("Content-Type", "application/xml");
//     res.status(200).send(rssFeed.trim());
//   } catch (error) {
//     console.error("Error generating RSS feed:", error);
//     res.status(500).send("Internal Server Error");
//   } 
// };


import { Article } from "../model/articel.model.js";
import { escape } from "html-escaper";

export const getRssFeedController = async (req, res) => {
  try {
    const articles = await Article.find({
      published_at_datetime: { $ne: null },
    })
      .sort({ published_at_datetime: -1 })
      .limit(10);

    const webLink = process.env.WEB_LINK || "https://sportzpoint.com/";

    const rssItems = articles
      .map(
        (article) => `
        <item>
          <title>${escape(article.title)}</title>
          <link>${webLink}/articles/${escape(article.slug)}</link>
          <description>${escape(article.summary || "")}</description>
          <pubDate>${new Date(article.published_at_datetime).toUTCString()}</pubDate>
          <category>${escape(article.primary_category?.name || "General")}</category>
          <guid isPermaLink="true">${webLink}/articles/${escape(article.slug)}</guid>
        </item>
      `
      )
      .join("");

    const rssFeed = `
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title>SportPoint News</title>
          <link>${webLink}</link>
          <description>Latest articles from SportPoint</description>
          <atom:link href="${webLink}/rss/rss-feed" rel="self" type="application/rss+xml" />
          ${rssItems}
        </channel>
      </rss>
    `;

    res.set("Content-Type", "application/xml");
    res.status(200).send(rssFeed.trim());
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    res.status(500).send("Internal Server Error");
  }
};
