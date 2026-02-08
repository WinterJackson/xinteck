import { BlogEditorForm } from "@/components/admin/BlogEditorForm";
import { BLOG_POSTS } from "@/lib/admin-data";

// In a real app, this would fetch data from params.id
// For now we mock it by picking the first item or finding by ID if we could access params properly in client
export default function EditPostPage({ params }: { params: { id: string } }) {
  // Simple mock find
  const post = BLOG_POSTS.find(p => p.id.toString() === params.id) || BLOG_POSTS[0];
  
  // Transform mock data to form format
  const initialData = {
    title: post.title,
    slug: post.title.toLowerCase().replace(/ /g, '-'),
    category: post.category,
    status: post.status,
    excerpt: "This is a simulated excerpt for the existing post...",
    content: "# Existing Content\n\nThis is the content loaded from the database simulation.",
    image: ""
  };

  return <BlogEditorForm initialData={initialData} isEditing={true} />;
}

// Allow static generation for detailed verification paths if needed, 
// but for Admin dashboard usually dynamic is fine.
export function generateStaticParams() {
   return BLOG_POSTS.map(post => ({
     id: post.id.toString()
   }));
}
