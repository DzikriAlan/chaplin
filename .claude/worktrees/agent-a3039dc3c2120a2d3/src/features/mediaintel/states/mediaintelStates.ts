import { create } from 'zustand'
import type {
  PayloadPostMediaintelTopikTimeline,
  MediaintelTopikTimeline,
  PayloadPostMediaintelTopikStatementPerson,
  MediaintelTopikStatementPerson,
  PayloadPostMediaintelTopikTopIssues,
  MediaintelTopikTopIssues,
  PayloadPostMediaintelTopikTopScore,
  MediaintelTopikTopScore,
  PayloadPostMediaintelTopikTopVersion,
  MediaintelTopikTopVersion,
  PayloadPostMediaintelComparationDashboardChartCombine,
  MediaintelComparationDashboardChartCombine,
  PayloadPostMediaintelTopikEkstraksiTimelineMatched,
  MediaintelTopikEkstraksiTimelineMatched,
  PayloadPostMediaintelComparationDashboardMap,
  MediaintelComparationDashboardMap,
  PayloadPostMediaintelTopikTopAccount,
  MediaintelTopikTopAccount,
  PayloadPostMediaintelTopikTopMedia,
  MediaintelTopikTopMedia,
} from '../types/mediaintelTypes'

interface MediaintelStore {
  payloadPostMediaintelTopikTimeline: PayloadPostMediaintelTopikTimeline
  mediaintelTopikTimeline: MediaintelTopikTimeline
  setPostMediaintelTopikTimeline: (payload: Partial<PayloadPostMediaintelTopikTimeline>) => void

  payloadPostMediaintelTopikStatementPerson: PayloadPostMediaintelTopikStatementPerson
  mediaintelTopikStatementPerson: MediaintelTopikStatementPerson
  setPostMediaintelTopikStatementPerson: (payload: Partial<PayloadPostMediaintelTopikStatementPerson>) => void

  payloadPostMediaintelTopikTopIssues: PayloadPostMediaintelTopikTopIssues
  mediaintelTopikTopIssues: MediaintelTopikTopIssues
  setPostMediaintelTopikTopIssues: (payload: Partial<PayloadPostMediaintelTopikTopIssues>) => void

  payloadPostMediaintelTopikTopScore: PayloadPostMediaintelTopikTopScore
  mediaintelTopikTopScore: MediaintelTopikTopScore
  setPostMediaintelTopikTopScore: (payload: Partial<PayloadPostMediaintelTopikTopScore>) => void

  payloadPostMediaintelTopikTopVersion: PayloadPostMediaintelTopikTopVersion
  mediaintelTopikTopVersion: MediaintelTopikTopVersion
  setPostMediaintelTopikTopVersion: (payload: Partial<PayloadPostMediaintelTopikTopVersion>) => void

  payloadPostMediaintelComparationDashboardChartCombine: PayloadPostMediaintelComparationDashboardChartCombine
  mediaintelComparationDashboardChartCombine: MediaintelComparationDashboardChartCombine
  setPostMediaintelComparationDashboardChartCombine: (payload: Partial<PayloadPostMediaintelComparationDashboardChartCombine>) => void

  payloadPostMediaintelTopikEkstraksiTimelineMatched: PayloadPostMediaintelTopikEkstraksiTimelineMatched
  mediaintelTopikEkstraksiTimelineMatched: MediaintelTopikEkstraksiTimelineMatched
  setPostMediaintelTopikEkstraksiTimelineMatched: (payload: Partial<PayloadPostMediaintelTopikEkstraksiTimelineMatched>) => void

  payloadPostMediaintelComparationDashboardMap: PayloadPostMediaintelComparationDashboardMap
  mediaintelComparationDashboardMap: MediaintelComparationDashboardMap
  setPostMediaintelComparationDashboardMap: (payload: Partial<PayloadPostMediaintelComparationDashboardMap>) => void

  payloadPostMediaintelTopikTopAccount: PayloadPostMediaintelTopikTopAccount
  mediaintelTopikTopAccount: MediaintelTopikTopAccount
  setPostMediaintelTopikTopAccount: (payload: Partial<PayloadPostMediaintelTopikTopAccount>) => void

  payloadPostMediaintelTopikTopMedia: PayloadPostMediaintelTopikTopMedia
  mediaintelTopikTopMedia: MediaintelTopikTopMedia
  setPostMediaintelTopikTopMedia: (payload: Partial<PayloadPostMediaintelTopikTopMedia>) => void
}

export const useMediaintelStates = create<MediaintelStore>((set) => ({
  payloadPostMediaintelTopikTimeline: {
    id: 0,
    range: '',
    time: '',
    sentiment: [],
    keyword: '',
    tokoh: [],
    organisasi: [],
    sort: [],
    max: 0,
    page: 0,
    source: [],
  },
  mediaintelTopikTimeline: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostMediaintelTopikTimeline: (payload) =>
    set((state) => ({
      payloadPostMediaintelTopikTimeline: { ...state.payloadPostMediaintelTopikTimeline, ...payload },
    })),

  payloadPostMediaintelTopikStatementPerson: {
    id: 0,
    range: '',
    time: '',
    sentiment: [],
    sentiment_statement: [],
    speakers: [],
    quote: '',
    source: [],
    page: 0,
    max: 0,
  },
  mediaintelTopikStatementPerson: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostMediaintelTopikStatementPerson: (payload) =>
    set((state) => ({
      payloadPostMediaintelTopikStatementPerson: { ...state.payloadPostMediaintelTopikStatementPerson, ...payload },
    })),

  payloadPostMediaintelTopikTopIssues: {
    id: 0,
    range: '',
    time: '',
    sentiment: [],
    source: [],
    format: '',
  },
  mediaintelTopikTopIssues: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostMediaintelTopikTopIssues: (payload) =>
    set((state) => ({
      payloadPostMediaintelTopikTopIssues: { ...state.payloadPostMediaintelTopikTopIssues, ...payload },
    })),

  payloadPostMediaintelTopikTopScore: {
    id: 0,
    range: '',
    score_query: '',
    source: [],
    sentiment: [],
  },
  mediaintelTopikTopScore: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostMediaintelTopikTopScore: (payload) =>
    set((state) => ({
      payloadPostMediaintelTopikTopScore: { ...state.payloadPostMediaintelTopikTopScore, ...payload },
    })),

  payloadPostMediaintelTopikTopVersion: {
    id: 0,
    range: '',
    version: '',
    source: [],
    sentiment: [],
    tier: null,
    max: 0,
  },
  mediaintelTopikTopVersion: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostMediaintelTopikTopVersion: (payload) =>
    set((state) => ({
      payloadPostMediaintelTopikTopVersion: { ...state.payloadPostMediaintelTopikTopVersion, ...payload },
    })),

  payloadPostMediaintelComparationDashboardChartCombine: {
    id: '',
    range: '',
    source: [],
    time: '',
    show_all: false,
  },
  mediaintelComparationDashboardChartCombine: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostMediaintelComparationDashboardChartCombine: (payload) =>
    set((state) => ({
      payloadPostMediaintelComparationDashboardChartCombine: { ...state.payloadPostMediaintelComparationDashboardChartCombine, ...payload },
    })),

  payloadPostMediaintelTopikEkstraksiTimelineMatched: {
    id: '',
    range: '',
    time: '',
    source: [],
    sentiment: [],
    search: '',
    max: 0,
    limit: 0,
    page: 0,
    sort: [],
    lang: [],
  },
  mediaintelTopikEkstraksiTimelineMatched: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostMediaintelTopikEkstraksiTimelineMatched: (payload) =>
    set((state) => ({
      payloadPostMediaintelTopikEkstraksiTimelineMatched: { ...state.payloadPostMediaintelTopikEkstraksiTimelineMatched, ...payload },
    })),

  payloadPostMediaintelComparationDashboardMap: {
    id: 0,
    keyword: '',
    range: '',
    source: [],
    lang: [],
    time: '',
  },
  mediaintelComparationDashboardMap: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostMediaintelComparationDashboardMap: (payload) =>
    set((state) => ({
      payloadPostMediaintelComparationDashboardMap: { ...state.payloadPostMediaintelComparationDashboardMap, ...payload },
    })),

  payloadPostMediaintelTopikTopAccount: {
    id: 0,
    range: '',
    time: '',
    tokoh: [],
    organisasi: [],
    keyword: '',
    kategori: [],
    sentiment: [],
    aspek: [],
    source: [],
    lang: [],
    keyword_global: '',
    show: [],
    version: '',
  },
  mediaintelTopikTopAccount: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostMediaintelTopikTopAccount: (payload) =>
    set((state) => ({
      payloadPostMediaintelTopikTopAccount: { ...state.payloadPostMediaintelTopikTopAccount, ...payload },
    })),

  payloadPostMediaintelTopikTopMedia: {
    id: 0,
    range: '',
    time: '',
    tokoh: [],
    organisasi: [],
    keyword: '',
    kategori: [],
    sentiment: [],
    aspek: [],
    source: [],
    lang: [],
    keyword_global: '',
  },
  mediaintelTopikTopMedia: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostMediaintelTopikTopMedia: (payload) =>
    set((state) => ({
      payloadPostMediaintelTopikTopMedia: { ...state.payloadPostMediaintelTopikTopMedia, ...payload },
    })),
}))
