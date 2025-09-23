import ProjectsList from '@/components/projects/list';
import ProjectsProvider from '@/components/projects/list/provider';
import { ProjectQuery } from '@/convex/query.config';

const Page = async () => {
  const { project, profile } = await ProjectQuery();

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to view your Project.</p>
        </div>
      </div>
    );
  }
  return (
    <ProjectsProvider initialProjects={project}>
      <div className="container mx-auto py-36 px-4">
        <ProjectsList />
      </div>
    </ProjectsProvider>
  );
};

export default Page;
