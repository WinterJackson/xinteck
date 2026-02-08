import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface BlogMeta {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  tag: string;
  slug: string;
}

export interface ProjectMeta {
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: string;
  client: string;
  role: string;
  image?: string;
  slug: string;
}

export async function getFiles(type: string) {
  const dirPath = path.join(contentDirectory, type);
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

export async function getFileBySlug(type: string, slug: string) {
  const filePath = path.join(contentDirectory, type, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    meta: {
      ...data,
      slug,
    } as any,
    content,
  };
}

export async function getAllFilesMetadata<T>(type: string): Promise<T[]> {
  const files = await getFiles(type);

  return files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const filePath = path.join(contentDirectory, type, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      ...data,
      slug,
    } as T;
  });
}
