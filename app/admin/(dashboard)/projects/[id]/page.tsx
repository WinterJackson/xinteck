import { ProjectEditorForm } from "@/components/admin/ProjectEditorForm";
import { PROJECTS } from "@/lib/admin-data";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = PROJECTS.find(p => p.id.toString() === params.id) || PROJECTS[0];
  
  const initialData = {
    title: project.title,
    client: project.client,
    category: project.category,
    status: project.status,
    url: "https://example.com/project", // Mock URL
    completionDate: "2025-10-24", // Mock Date
    description: "This project aimed to revolutionize the client's digital presence...",
    image: project.image
  };

  return <ProjectEditorForm initialData={initialData} isEditing={true} />;
}

export function generateStaticParams() {
   return PROJECTS.map(project => ({
     id: project.id.toString()
   }));
}
