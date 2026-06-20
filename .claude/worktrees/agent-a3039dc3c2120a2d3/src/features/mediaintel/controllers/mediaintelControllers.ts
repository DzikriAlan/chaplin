import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMediaintelStates } from '../states/mediaintelStates'
import {
  postMediaintelTopikTimeline,
  postMediaintelTopikStatementPerson,
  postMediaintelTopikTopIssues,
  postMediaintelTopikTopScore,
  postMediaintelTopikTopVersion,
  postMediaintelComparationDashboardChartCombine,
  postMediaintelTopikEkstraksiTimelineMatched,
  postMediaintelComparationDashboardMap,
  postMediaintelTopikTopAccount,
  postMediaintelTopikTopMedia,
} from '../services/mediaintelServices'
import type {
  PayloadPostMediaintelTopikTimeline,
  PayloadPostMediaintelTopikStatementPerson,
  PayloadPostMediaintelTopikTopIssues,
  PayloadPostMediaintelTopikTopScore,
  PayloadPostMediaintelTopikTopVersion,
  PayloadPostMediaintelComparationDashboardChartCombine,
  PayloadPostMediaintelTopikEkstraksiTimelineMatched,
  PayloadPostMediaintelComparationDashboardMap,
  PayloadPostMediaintelTopikTopAccount,
  PayloadPostMediaintelTopikTopMedia,
} from '../types/mediaintelTypes'

export const useMediaintelControllers = () => {
  const queryClient = useQueryClient()
  const {
    mediaintelTopikTimeline,
    mediaintelTopikStatementPerson,
    mediaintelTopikTopIssues,
    mediaintelTopikTopScore,
    mediaintelTopikTopVersion,
    mediaintelComparationDashboardChartCombine,
    mediaintelTopikEkstraksiTimelineMatched,
    mediaintelComparationDashboardMap,
    mediaintelTopikTopAccount,
    mediaintelTopikTopMedia,
  } = useMediaintelStates()

  const storeMediaintelTopikTimeline = useMutation({
    mutationFn: (payload: PayloadPostMediaintelTopikTimeline) => postMediaintelTopikTimeline(payload),
    onMutate: () => {
      mediaintelTopikTimeline.status = 'loading'
    },
    onSuccess: (data) => {
      mediaintelTopikTimeline.data = data ?? null
      mediaintelTopikTimeline.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['mediaintelTopikTimeline'] })
    },
    onError: () => {
      mediaintelTopikTimeline.status = 'error'
    },
  })

  const storeMediaintelTopikStatementPerson = useMutation({
    mutationFn: (payload: PayloadPostMediaintelTopikStatementPerson) => postMediaintelTopikStatementPerson(payload),
    onMutate: () => {
      mediaintelTopikStatementPerson.status = 'loading'
    },
    onSuccess: (data) => {
      mediaintelTopikStatementPerson.data = data ?? null
      mediaintelTopikStatementPerson.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['mediaintelTopikStatementPerson'] })
    },
    onError: () => {
      mediaintelTopikStatementPerson.status = 'error'
    },
  })

  const storeMediaintelTopikTopIssues = useMutation({
    mutationFn: (payload: PayloadPostMediaintelTopikTopIssues) => postMediaintelTopikTopIssues(payload),
    onMutate: () => {
      mediaintelTopikTopIssues.status = 'loading'
    },
    onSuccess: (data) => {
      mediaintelTopikTopIssues.data = data ?? null
      mediaintelTopikTopIssues.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['mediaintelTopikTopIssues'] })
    },
    onError: () => {
      mediaintelTopikTopIssues.status = 'error'
    },
  })

  const storeMediaintelTopikTopScore = useMutation({
    mutationFn: (payload: PayloadPostMediaintelTopikTopScore) => postMediaintelTopikTopScore(payload),
    onMutate: () => {
      mediaintelTopikTopScore.status = 'loading'
    },
    onSuccess: (data) => {
      mediaintelTopikTopScore.data = data ?? null
      mediaintelTopikTopScore.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['mediaintelTopikTopScore'] })
    },
    onError: () => {
      mediaintelTopikTopScore.status = 'error'
    },
  })

  const storeMediaintelTopikTopVersion = useMutation({
    mutationFn: (payload: PayloadPostMediaintelTopikTopVersion) => postMediaintelTopikTopVersion(payload),
    onMutate: () => {
      mediaintelTopikTopVersion.status = 'loading'
    },
    onSuccess: (data) => {
      mediaintelTopikTopVersion.data = data ?? null
      mediaintelTopikTopVersion.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['mediaintelTopikTopVersion'] })
    },
    onError: () => {
      mediaintelTopikTopVersion.status = 'error'
    },
  })

  const storeMediaintelComparationDashboardChartCombine = useMutation({
    mutationFn: (payload: PayloadPostMediaintelComparationDashboardChartCombine) => postMediaintelComparationDashboardChartCombine(payload),
    onMutate: () => {
      mediaintelComparationDashboardChartCombine.status = 'loading'
    },
    onSuccess: (data) => {
      mediaintelComparationDashboardChartCombine.data = data ?? null
      mediaintelComparationDashboardChartCombine.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['mediaintelComparationDashboardChartCombine'] })
    },
    onError: () => {
      mediaintelComparationDashboardChartCombine.status = 'error'
    },
  })

  const storeMediaintelTopikEkstraksiTimelineMatched = useMutation({
    mutationFn: (payload: PayloadPostMediaintelTopikEkstraksiTimelineMatched) => postMediaintelTopikEkstraksiTimelineMatched(payload),
    onMutate: () => {
      mediaintelTopikEkstraksiTimelineMatched.status = 'loading'
    },
    onSuccess: (data) => {
      mediaintelTopikEkstraksiTimelineMatched.data = data ?? null
      mediaintelTopikEkstraksiTimelineMatched.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['mediaintelTopikEkstraksiTimelineMatched'] })
    },
    onError: () => {
      mediaintelTopikEkstraksiTimelineMatched.status = 'error'
    },
  })

  const storeMediaintelComparationDashboardMap = useMutation({
    mutationFn: (payload: PayloadPostMediaintelComparationDashboardMap) => postMediaintelComparationDashboardMap(payload),
    onMutate: () => {
      mediaintelComparationDashboardMap.status = 'loading'
    },
    onSuccess: (data) => {
      mediaintelComparationDashboardMap.data = data ?? null
      mediaintelComparationDashboardMap.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['mediaintelComparationDashboardMap'] })
    },
    onError: () => {
      mediaintelComparationDashboardMap.status = 'error'
    },
  })

  const storeMediaintelTopikTopAccount = useMutation({
    mutationFn: (payload: PayloadPostMediaintelTopikTopAccount) => postMediaintelTopikTopAccount(payload),
    onMutate: () => {
      mediaintelTopikTopAccount.status = 'loading'
    },
    onSuccess: (data) => {
      mediaintelTopikTopAccount.data = data ?? null
      mediaintelTopikTopAccount.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['mediaintelTopikTopAccount'] })
    },
    onError: () => {
      mediaintelTopikTopAccount.status = 'error'
    },
  })

  const storeMediaintelTopikTopMedia = useMutation({
    mutationFn: (payload: PayloadPostMediaintelTopikTopMedia) => postMediaintelTopikTopMedia(payload),
    onMutate: () => {
      mediaintelTopikTopMedia.status = 'loading'
    },
    onSuccess: (data) => {
      mediaintelTopikTopMedia.data = data ?? null
      mediaintelTopikTopMedia.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['mediaintelTopikTopMedia'] })
    },
    onError: () => {
      mediaintelTopikTopMedia.status = 'error'
    },
  })

  return {
    storeMediaintelTopikTimeline,
    storeMediaintelTopikStatementPerson,
    storeMediaintelTopikTopIssues,
    storeMediaintelTopikTopScore,
    storeMediaintelTopikTopVersion,
    storeMediaintelComparationDashboardChartCombine,
    storeMediaintelTopikEkstraksiTimelineMatched,
    storeMediaintelComparationDashboardMap,
    storeMediaintelTopikTopAccount,
    storeMediaintelTopikTopMedia,
  }
}
