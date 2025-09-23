import { TabsContent } from '@/components/ui/tabs';
import { StyleGuideQuery } from '@/convex/query.config';

type Props = {
  searchParams: Promise<{
    project: string;
  }>;
};

const page = async ({ searchParams }: Props) => {
  const projectId = (await searchParams).project;
  const existingStyleGuide = await StyleGuideQuery(projectId);

  const guide = existingStyleGuide.styleGuide?._valueJSON as unknown as StyleGuide;

  return (
    <div className="">
      <TabsContent value="colours" className="space-y-8"></TabsContent>
    </div>
  );
};

export default page;
