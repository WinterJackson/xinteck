import { getBlogPost } from "@/actions/blog";
import { BlogEditorForm } from "@/components/admin/BlogEditorForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  if (params.id === "new") {
    return <BlogEditorForm isEditing={false} />;
  }

  const post = await getBlogPost(params.id);

  if (!post) {
    notFound();
  }

  return <BlogEditorForm initialData={post} isEditing={true} />;
}
