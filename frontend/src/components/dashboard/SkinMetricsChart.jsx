import React from 'react';
import { useTranslation } from 'react-i18next';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function SkinMetricsChart({ metrics }) {
  const { t } = useTranslation();

  const labels = [
    t('dashboard.metrics.sebum'),
    t('dashboard.metrics.pore'),
    t('dashboard.metrics.moisture'),
    t('dashboard.metrics.pigmentation'),
    t('dashboard.metrics.sensitivity'),
    t('dashboard.metrics.acne')
  ];

  // Map values, scale acne severity (0-5) to 0-100 scale for visual balance
  const dataValues = [
    metrics?.tzone?.sebum || 0,
    metrics?.tzone?.poreSize || 0,
    metrics?.uzone?.moisture || 0,
    metrics?.uzone?.pigmentation || 0,
    metrics?.overall?.sensitivity || 0,
    (metrics?.overall?.acneSeverity || 0) * 20
  ];

  const data = {
    labels,
    datasets: [
      {
        label: t('dashboard.chart_title'),
        data: dataValues,
        backgroundColor: 'rgba(200, 39, 78, 0.2)', // Primary Rose Gold HSL equivalent
        borderColor: 'rgba(200, 39, 78, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(153, 102, 204, 1)', // Accent Violet HSL equivalent
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(200, 39, 78, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(0, 0, 0, 0.08)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.08)'
        },
        pointLabels: {
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: '500'
          },
          color: 'var(--color-text-secondary)'
        },
        ticks: {
          backdropColor: 'transparent',
          color: 'var(--color-text-muted)',
          font: {
            size: 9
          },
          stepSize: 20
        },
        min: 0,
        max: 100,
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            let val = context.raw;
            if (index === 5) {
              // Convert scaled acne back to 0-5 for tooltip
              return `${context.label}: ${val / 20}/5`;
            }
            return `${context.label}: ${val}%`;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '320px', width: '100%', position: 'relative' }}>
      <Radar data={data} options={options} />
    </div>
  );
}

export default SkinMetricsChart;
