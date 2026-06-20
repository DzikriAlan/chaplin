'use client'

import { useState, useRef } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

// ── Dummy data ──────────────────────────────────────────────────

const mediaTeratasData = [
  { name: 'Kompas.id', tier: 'Tier 1', category: 'Media Online', coverage: 'Cakupan Nasional', sentiment: 'positif' },
  { name: 'Kompas.com', tier: 'Tier 1', category: 'Media Online', coverage: 'Cakupan Nasional', sentiment: 'negatif' },
  { name: 'Detikcom', tier: 'Tier 1', category: 'Media Online', coverage: 'Cakupan Nasional', sentiment: 'netral' },
]

const isuNegatifData = [
  { source: 'Kompas.id', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', date: '13 Maret 2023' },
  { source: 'Kompas.id', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', date: '13 Maret 2023' },
  { source: 'Detikcom', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', date: '13 Maret 2023' },
]

const sorotan3pData = [
  { tag: 'Portfolio', source: 'Kompas.id', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '13 Maret 2023' },
  { tag: 'People', source: 'Detikcom', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '13 Maret 2023' },
  { tag: 'Public Contribution', source: 'Kompas.id', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '13 Maret 2023' },
]

const sentimentData = { positif: 33.3, netral: 33.3, negatif: 33.3 }

const emosiData = [
  { label: 'Antisipasi', value: 999 },
  { label: 'Kepercayaan', value: 999 },
  { label: 'Kemarahan', value: 999 },
  { label: 'Ketakutan', value: 999 },
  { label: 'Jijik', value: 999 },
  { label: 'Kegembiraan', value: 999 },
  { label: 'Kesedihan', value: 999 },
  { label: 'Kejutan', value: 999 },
]

// ── Sub-components ──────────────────────────────────────────────

function CardWrapper({ title, tooltip, children }: Readonly<{ title: string; tooltip?: string; children: React.ReactNode }>) {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card text-card-foreground shadow-card">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-rem-100 font-semibold text-dark-text leading-none">{title}</span>
          {tooltip && (
            <span className="cursor-help text-muted-foreground text-rem-90 leading-none" title={tooltip}>&#9432;</span>
          )}
        </div>
        <button
          type="button"
          className="text-muted-foreground hover:text-dark-text text-rem-110 leading-none"
          title="More"
        >
          &#8942;
        </button>
      </div>
      <div className="flex-1 px-6 py-4">{children}</div>
    </div>
  )
}

function MediaTeratasCard() {
  const sentimentBadge: Record<string, string> = {
    positif: 'bg-pos-light text-pos',
    negatif: 'bg-neg-light text-neg',
    netral: 'bg-grey-300 text-grey-700',
  }

  const getSentimentLabel = (sentiment: string): string => {
    if (sentiment === 'positif') return 'Positif'
    if (sentiment === 'negatif') return 'Negatif'
    return 'Netral'
  }

  return (
    <CardWrapper title="3 Media Teratas" tooltip="Media dengan jumlah pemberitaan tertinggi">
      <div className="space-y-5">
        {mediaTeratasData.map((item, idx) => (
          <div key={item.name}>
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-grey-200 text-xs font-bold text-grey-700">
                {idx + 1}
              </span>
              <span className="text-rem-90 font-semibold text-dark-text">{item.name}</span>
            <span className={`ml-auto rounded-full px-2.5 py-0.5 text-rem-70 font-semibold ${sentimentBadge[item.sentiment]}`}>
                {getSentimentLabel(item.sentiment)}
              </span>
            </div>
            <p className="pl-8 text-rem-75 text-muted-foreground">
              {item.tier} / {item.category} / {item.coverage}
            </p>
          </div>
        ))}
      </div>
    </CardWrapper>
  )
}

function PetaPersebaranCard() {
  return (
    <CardWrapper title="Peta Persebaran Topik" tooltip="Sebaran topik berdasarkan wilayah">
      <div className="flex flex-col items-center">
        {/* Simplified Indonesia Map SVG */}
        <svg viewBox="0 0 500 300" className="mb-4 w-full max-w-[280px]">
          {/* Sumatra */}
          <ellipse cx="100" cy="120" rx="25" ry="65" fill="#dbeafe" stroke="#60a5fa" strokeWidth="1" />
          {/* Jawa */}
          <ellipse cx="220" cy="195" rx="55" ry="12" fill="#dbeafe" stroke="#60a5fa" strokeWidth="1" />
          {/* Kalimantan */}
          <ellipse cx="240" cy="140" rx="45" ry="30" fill="#dbeafe" stroke="#60a5fa" strokeWidth="1" />
          {/* Sulawesi */}
          <ellipse cx="340" cy="145" rx="20" ry="35" fill="#dbeafe" stroke="#60a5fa" strokeWidth="1" />
          {/* Papua */}
          <ellipse cx="430" cy="150" rx="40" ry="25" fill="#dbeafe" stroke="#60a5fa" strokeWidth="1" />
          {/* Kepulauan Maluku */}
          <ellipse cx="380" cy="170" rx="12" ry="15" fill="#dbeafe" stroke="#60a5fa" strokeWidth="1" />

          {/* Dots for regions */}
          <circle cx="100" cy="100" r="5" fill="#3b82f6" opacity="0.8" />
          <circle cx="220" cy="190" r="6" fill="#3b82f6" opacity="0.9" />
          <circle cx="240" cy="135" r="4" fill="#3b82f6" opacity="0.7" />
          <circle cx="340" cy="150" r="3" fill="#3b82f6" opacity="0.6" />
          <circle cx="100" cy="140" r="3" fill="#3b82f6" opacity="0.6" />
          <circle cx="340" cy="130" r="3" fill="#3b82f6" opacity="0.6" />
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-rem-70 text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500 opacity-90" />
            <span>&gt; 300</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500 opacity-70" />
            <span>200 - 300</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500 opacity-50" />
            <span>100 - 200</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500 opacity-30" />
            <span>&lt; 100</span>
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

function IsuNegatifCard() {
  return (
    <CardWrapper title="Sorotan Isu Negatif" tooltip="Isu negatif yang sedang menjadi sorotan media">
      <div className="space-y-4">
        {isuNegatifData.map((item, idx) => (
          <div key={`${item.source}-${idx}`} className="border-b pb-3 last:border-0 last:pb-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-rem-90 font-semibold text-dark-text">{item.source}</span>
              <span className="text-rem-75 text-muted-foreground">{item.date}</span>
            </div>
            <p className="text-rem-80 leading-relaxed text-muted-foreground line-clamp-2">{item.content}</p>
          </div>
        ))}
      </div>
    </CardWrapper>
  )
}

function Sorotan3PCard() {
  const tagColors: Record<string, string> = {
    Portfolio: 'bg-gold-50 text-gold-700',
    People: 'bg-blue-100 text-blue-700',
    'Public Contribution': 'bg-pos-light text-pos',
  }

  return (
    <CardWrapper title="Sorotan Berita 3P (Portfolio, People, dan Public Contribution)" tooltip="Klasifikasi berita berdasarkan kategori Portfolio, People, dan Public Contribution">
      <div className="space-y-4">
        {sorotan3pData.map((item, idx) => (
          <div key={`${item.tag}-${idx}`} className="border-b pb-3 last:border-0 last:pb-0">
            <div className="mb-1 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-rem-70 font-semibold ${tagColors[item.tag] ?? 'bg-muted text-muted-foreground'}`}>
                {item.tag}
              </span>
              <span className="text-rem-75 text-muted-foreground">{item.date}</span>
            </div>
            <p className="text-rem-80 leading-relaxed text-muted-foreground line-clamp-2">{item.content}</p>
            <span className="mt-1 text-rem-80 font-medium text-dark-text">{item.source}</span>
          </div>
        ))}
      </div>
    </CardWrapper>
  )
}

function SentimenPemberitaanCard() {
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 220,
      backgroundColor: 'transparent',
    },
    title: { text: undefined },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        innerSize: '60%',
        dataLabels: { enabled: false },
        showInLegend: true,
        size: '100%',
        center: ['50%', '50%'],
      },
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: { fontSize: '11px', color: '#A2A5B9' },
      symbolRadius: 6,
    },
    series: [
      {
        type: 'pie',
        name: 'Sentimen',
        data: [
          { name: 'Positif', y: sentimentData.positif, color: '#3EC764' },
          { name: 'Netral', y: sentimentData.netral, color: '#b5b5b5' },
          { name: 'Negatif', y: sentimentData.negatif, color: '#ED3E3E' },
        ],
      },
    ],
    credits: { enabled: false },
  }

  return (
    <CardWrapper title="Sentimen Pemberitaan" tooltip="Distribusi sentimen dari seluruh pemberitaan">
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </CardWrapper>
  )
}

function AnalisisEmosiCard() {
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: 260,
      backgroundColor: 'transparent',
    },
    title: { text: undefined },
    xAxis: {
      categories: emosiData.map((d) => d.label),
      labels: { style: { fontSize: '10px', color: '#A2A5B9' } },
      lineWidth: 0,
      tickWidth: 0,
    },
    yAxis: {
      visible: false,
      title: { text: undefined },
      gridLineWidth: 0,
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b>',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          align: 'right',
          format: '{point.y}',
          style: { fontSize: '10px', fontWeight: '600', color: '#283252' },
        },
        groupPadding: 0.15,
      },
    },
    series: [
      {
        type: 'bar',
        name: 'Nilai',
        data: emosiData.map((d) => ({
          y: d.value,
          color: '#EF7E48',
        })),
      },
    ],
    credits: { enabled: false },
  }

  return (
    <CardWrapper title="Analisis Emosi" tooltip="Analisis emosi dari pemberitaan dan percakapan publik">
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </CardWrapper>
  )
}

// ── Dashboard header & filters ──────────────────────────────────

interface FilterBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

function FilterBar({ activeTab, onTabChange }: Readonly<FilterBarProps>) {
  const tabs = ['United Tractors', 'Kompetitor']
  const dateFilters = ['Hari Ini', '7 Hari Terakhir', '30 Hari Terakhir', '3 Bulan Terakhir', 'Atur Tanggal']

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h1 className="text-rem-150 font-bold text-dark-text">Pusat Pemantauan Komunikasi AHEMCE</h1>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`rounded-md px-4 py-1.5 text-rem-100 font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-background text-dark-text shadow-card'
                  : 'text-light-text hover:text-dark-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded px-3 py-1.5 text-rem-85 font-semibold text-dark-text cursor-pointer appearance-none"
            style={{
              background: 'white url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%23999\'/%3E%3C/svg%3E") no-repeat right 10px center',
              border: '1.5px solid #dbdbdb',
              paddingRight: '28px',
            }}
          >
            <option>All Source</option>
          </select>

          {dateFilters.map((f) => (
            <button
              key={f}
              type="button"
              className="rounded px-4 py-1.5 text-rem-85 font-semibold text-dark-text cursor-pointer transition-all duration-200"
              style={{ background: 'white', border: '1.5px solid #dbdbdb' }}
            >
              {f}
            </button>
          ))}

          <button
            type="button"
            className="rounded-lg bg-foreground px-4 py-1.5 text-rem-85 font-semibold text-background shadow-btn-hover transition-opacity hover:opacity-90"
          >
            Preview Report
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────

export default function EksekutifData() {
  const [activeTab, setActiveTab] = useState('United Tractors')

  function handleTabChange(tab: string) {
    setActiveTab(tab)
  }

  return (
    <div className="flex min-h-screen flex-col px-6 py-6 sm:px-8 lg:px-10">
      <FilterBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 3 Columns x 2 Rows Grid */}
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-2">
        {/* Row 1 */}
        <MediaTeratasCard />
        <PetaPersebaranCard />
        <IsuNegatifCard />

        {/* Row 2 */}
        <Sorotan3PCard />
        <SentimenPemberitaanCard />
        <AnalisisEmosiCard />
      </div>
    </div>
  )
}
