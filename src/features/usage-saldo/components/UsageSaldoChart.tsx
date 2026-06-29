'use client'

interface UsageSaldoChartProps {
  isMounted: boolean
  daysInMonth: number
  selectedMonth: number
  dailyData: number[]
}

export default function UsageSaldoChart({ isMounted, daysInMonth, selectedMonth, dailyData }: Readonly<UsageSaldoChartProps>) {
  if (!isMounted) {
    return <div className="h-[200px] bg-muted/20 rounded animate-pulse" />
  }

  // Dynamic require needed for client-side hydration compatibility with SSR
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const Highcharts = require('highcharts') as typeof import('highcharts')
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const HighchartsReact = (require('highcharts-react-official') as { default: typeof import('highcharts-react-official').default }).default

  const allDayCategories = Array.from(
    { length: daysInMonth },
    (_, i) => `${selectedMonth}-${i + 1}`,
  )

  const chartOptions = {
    chart: { type: 'column', backgroundColor: 'transparent', height: 200, margin: [20, 0, 30, 55] },
    title: { text: '' },
    xAxis: {
      categories: allDayCategories,
      labels: { step: 5, style: { color: '#6B7280', fontSize: '10px' } },
      lineColor: '#374151',
      tickColor: 'transparent',
    },
    yAxis: {
      title: { text: '' },
      labels: {
        format: 'Rp {value}',
        style: { color: '#6B7280', fontSize: '10px' },
      },
      gridLineColor: '#374151',
    },
    series: [{
      type: 'column',
      name: 'Pengeluaran',
      data: dailyData,
      color: '#F59E0B',
      borderWidth: 0,
      borderRadius: 2,
      pointPadding: 0.05,
      groupPadding: 0,
    }],
    legend: { enabled: false },
    tooltip: {
      backgroundColor: '#1F2937',
      style: { color: '#F9FAFB', fontSize: '12px' },
      headerFormat: '',
      pointFormat: '{point.category}: <b>Rp {point.y}</b>',
    },
    credits: { enabled: false },
    plotOptions: { column: { borderWidth: 0 } },
  }

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
}
