import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface AutoSaveProjectRequest {
  projectId: string;
  userId: string;
  shapesData: {
    shapes: Record<string, unknown>;
    tool: string;
    selected: Record<string, unknown>;
    frameCounter: number;
  };
  viewportData?: {
    scale: number;
    translate: { x: number; y: number };
  };
}

interface AutoSaveProjectResponse {
  success: boolean;
  message: string;
  eventId: string;
}

export const ProjectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/project' }),
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    autoSaveProject: builder.mutation<AutoSaveProjectResponse, AutoSaveProjectRequest>({
      query: (data) => ({
        url: '',
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});
