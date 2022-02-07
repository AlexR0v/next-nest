import { createApi }           from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export const trackApi = createApi({
  reducerPath: 'trackApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Tracks'],
  endpoints: (builder) => ({
    getAllTracks: builder.query({
      query: () => '/tracks',
      providesTags: ['Tracks']
    }),
    getTrack: builder.query({
      query: (id) => '/tracks/' + id,
      providesTags: (result, error, id) => {
        return [{ type: 'Tracks', id }]
      }
    }),
    addComment: builder.mutation({
      query: ({ text, trackId }) => ({
        url: '/tracks/comment',
        method: 'POST',
        body: { text, trackId }
      }),
      invalidatesTags: (result, error, { trackId }) => [{ type: 'Tracks', id: trackId }]
    }),
    addTrack: builder.mutation({
      query: (data: FormData) => ({
        url: '/tracks',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Tracks']
    }),
    deleteTrack: builder.mutation({
      query: (id: string) => ({
        url: `/tracks/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Tracks']
    })
  })
})

export const {
  useGetAllTracksQuery,
  useGetTrackQuery,
  useAddCommentMutation,
  useAddTrackMutation,
  useDeleteTrackMutation
} = trackApi
