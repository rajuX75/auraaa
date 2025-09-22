'use client';

import { generateRandomGradientSVG } from '@/lib/generate-thumbnail';
import {
  addProject,
  createProjectFailure,
  createProjectStart,
  createProjectSuccess,
} from '@/redux/slice/projects';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchMutation } from 'convex/nextjs';
import { toast } from 'sonner';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export const useProjectCreation = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.profile);
  const projectState = useAppSelector((state) => state.project);
  const shapesState = useAppSelector((state) => state.shapes);

  const createProject = async (name?: string) => {
    if (!user?.id) {
      toast.error('Authentication Required', {
        description: 'Please sign in to your account to create and manage projects',
      });
      return;
    }
    dispatch(createProjectStart());
    try {
      const thumbnail = generateRandomGradientSVG();

      const result = await fetchMutation(api.projects.createProject, {
        userId: user.id as Id<'users'>,
        name: name || undefined,
        sketchsData: {
          shapes: shapesState.shapes,
          tool: shapesState.tool,
          selected: shapesState.selected,
          frameCounter: shapesState.frameCounter,
        },
        thumbnail,
      });

      dispatch(
        addProject({
          _id: result.projectId,
          name: result.name,
          projectNumber: result.projectNumber,
          thumbnail,
          lastModified: Date.now(),
          createdAt: Date.now(),
          isPublic: false,
        })
      );
      dispatch(createProjectSuccess());
      toast.success('Project Created Successfully', {
        description: 'Your project has been created and is ready to manage.',
      });
    } catch (error) {
      dispatch(createProjectFailure('Faild to create project'));
      toast.error('Project Creation Failed', {
        description: 'Something went wrong while creating your project. Please try again.',
      });
    }
  };

  return {
    createProject,
    isCreating: projectState?.isCreating,
    projects: projectState?.projects,
    projectsTotal: projectState?.total,
    canCreate: !!user?.id,
  };
};
