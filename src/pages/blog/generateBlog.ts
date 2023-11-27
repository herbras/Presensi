import { faker } from "@faker-js/faker";

interface Author {
  name: string;
  photo: string;
  bio: string;
  socialMediaLinks: {
    linkedin: string;
    twitter: string;
    other: string;
  };
}

interface FeaturedArticle {
  id: string;
  title: string;
  summary: string;
  publishedDate: string;
  readTime: string;
  category: string;
  imageUrl: string;
  articleUrl: string;
  slug: string;
  author: Author;
  tags: string[];
  language: string;
  modifiedDate: string;
  featured: boolean;
  commentsEnabled: boolean;
  sources: {
    name: string;
    url: string;
  }[];
}

interface LatestArticle {
  id: string;
  title: string;
  summary: string;
  publishedDate: string;
  readTime: string;
  category: string;
  imageUrl: string;
  articleUrl: string;
  slug: string;
  authorPhoto: string;
  authorName: string;
}

interface LatestArticlesData {
  latestArticles: LatestArticle[];
}
let featuredArticles: FeaturedArticle[] = []; 
for (let i = 0; i < 1; i++) {
  featuredArticles.push({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    summary: faker.lorem.paragraph(),
    publishedDate: faker.date.past().toISOString().split('T')[0],
    readTime: `${faker.number.int({ min: 3, max: 10 })} min read`,
    category: faker.lorem.word(),
    imageUrl: faker.image.url(),
    articleUrl: `/blog/featured/${faker.lorem.slug()}`,
    slug: faker.lorem.slug(),
    author: {
      name: "ibrahim",
      photo:"https://pbs.twimg.com/profile_images/1704715589481332736/J6vLVH9s_400x400.jpg",

      bio: faker.lorem.sentence(),
      socialMediaLinks: {
        linkedin: `https://linkedin.com/in/${faker.internet.userName()}`,
        twitter: `https://twitter.com/${faker.internet.userName()}`,
        other: faker.internet.url(),
      }
    },
    tags: Array.from({ length: 5 }, () => faker.lorem.word()),
    language: 'English', // or any other language
    modifiedDate: faker.date.recent().toISOString().split('T')[0],
    featured: faker.datatype.boolean(),
    commentsEnabled: faker.datatype.boolean(),
    sources: Array.from({ length: 3 }, () => ({ // Array.from for safety
      name: "Sarbeh", 
      url: "https://sarbeh.com"
    })),
  });
}
let latestArticles: LatestArticle[] = [];
for (let i = 0; i < 150; i++) {
  latestArticles.push({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    summary: faker.lorem.paragraph(),
    publishedDate: faker.date.past().toISOString(),
    readTime: `${faker.number.int({ min: 3, max: 10 })} min read`,
    category: faker.lorem.word(),
    imageUrl: faker.image.url(),
    articleUrl: `/blog/${faker.lorem.slug()}`,
    slug: faker.lorem.slug(),
    authorPhoto:      "https://pbs.twimg.com/profile_images/1704715589481332736/J6vLVH9s_400x400.jpg",
    authorName: "Ibrahim Nurul Huda",
  });
}

export const featuredArticleData: FeaturedArticleData = { featuredArticles };
export const latestArticlesData: LatestArticlesData = { latestArticles };
