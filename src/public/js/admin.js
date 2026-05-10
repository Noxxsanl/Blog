(function () {
    'use strict';

    /* =========================================================
       FLASH TOAST AUTO-DISMISS
       ========================================================= */
    const flashToast = document.getElementById('flashToast');
    if (flashToast) {
        const DISPLAY_MS = 4000;
        const FADE_MS = 350;

        const dismiss = () => {
            flashToast.classList.add('flash-toast-out');
            setTimeout(() => flashToast.remove(), FADE_MS);
        };

        setTimeout(dismiss, DISPLAY_MS);
    }

    /* =========================================================
       SIDEBAR TOGGLE
       ========================================================= */
    const sidebar = document.getElementById('adminSidebar');
    const main = document.getElementById('adminMain');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const overlay = document.getElementById('sidebarOverlay');
    const COLLAPSED_KEY = 'adminSidebarCollapsed';

    function isMobile() {
        return window.innerWidth < 768;
    }

    function collapseSidebar() {
        if (isMobile()) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        } else {
            sidebar.classList.add('collapsed');
            main.classList.add('collapsed');
            localStorage.setItem(COLLAPSED_KEY, '1');
        }
    }

    function expandSidebar() {
        if (isMobile()) {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
        } else {
            sidebar.classList.remove('collapsed');
            main.classList.remove('collapsed');
            localStorage.removeItem(COLLAPSED_KEY);
        }
    }

    function toggleSidebar() {
        if (isMobile()) {
            sidebar.classList.contains('mobile-open') ? collapseSidebar() : expandSidebar();
        } else {
            sidebar.classList.contains('collapsed') ? expandSidebar() : collapseSidebar();
        }
    }

    // Restore collapsed state on desktop
    if (!isMobile() && localStorage.getItem(COLLAPSED_KEY)) {
        sidebar.classList.add('collapsed');
        main.classList.add('collapsed');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', collapseSidebar);

    window.addEventListener('resize', function () {
        if (!isMobile()) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            if (localStorage.getItem(COLLAPSED_KEY)) {
                sidebar.classList.add('collapsed');
                main.classList.add('collapsed');
            }
        }
    });

    /* =========================================================
       SEARCH FORM — Enter key submit
       ========================================================= */
    const filterInput = document.querySelector('.filter-input');
    if (filterInput) {
        filterInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.closest('form').submit();
            }
        });
    }

    /* =========================================================
       CHART.JS INITIALIZATION
       ========================================================= */
    const chartDataEl = document.getElementById('dashboardChartData');
    if (!chartDataEl || typeof Chart === 'undefined') return;

    let chartData;
    try {
        chartData = JSON.parse(chartDataEl.textContent);
    } catch (e) {
        console.warn('Failed to parse chart data', e);
        return;
    }

    const PALETTE = {
        blue:   '#3b82f6',
        green:  '#22c55e',
        purple: '#a855f7',
        orange: '#f97316',
        teal:   '#14b8a6',
        indigo: '#6366f1',
        red:    '#ef4444',
        yellow: '#eab308',
    };

    const defaultFont = {
        family: "'Inter', 'Segoe UI', system-ui, sans-serif",
        size: 12,
    };

    Chart.defaults.font = defaultFont;
    Chart.defaults.color = '#64748b';

    /* -- Courses per month (line) -- */
    const coursesLineCtx = document.getElementById('coursesLineChart');
    if (coursesLineCtx && chartData.coursesPerMonth) {
        new Chart(coursesLineCtx, {
            type: 'line',
            data: {
                labels: chartData.coursesPerMonth.labels,
                datasets: [{
                    label: 'Courses Created',
                    data: chartData.coursesPerMonth.data,
                    borderColor: PALETTE.blue,
                    backgroundColor: 'rgba(59,130,246,.1)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: .35,
                    pointRadius: 4,
                    pointBackgroundColor: PALETTE.blue,
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: ctx => ` ${ctx.parsed.y} course${ctx.parsed.y !== 1 ? 's' : ''}`,
                        },
                    },
                },
                scales: {
                    x: { grid: { display: false }, border: { display: false } },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f1f5f9' },
                        border: { display: false },
                        ticks: { stepSize: 1 },
                    },
                },
            },
        });
    }

    /* -- Users per month (bar) -- */
    const usersBarCtx = document.getElementById('usersBarChart');
    if (usersBarCtx && chartData.usersPerMonth) {
        new Chart(usersBarCtx, {
            type: 'bar',
            data: {
                labels: chartData.usersPerMonth.labels,
                datasets: [{
                    label: 'Users Registered',
                    data: chartData.usersPerMonth.data,
                    backgroundColor: 'rgba(168,85,247,.8)',
                    borderRadius: 6,
                    borderSkipped: false,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: ctx => ` ${ctx.parsed.y} user${ctx.parsed.y !== 1 ? 's' : ''}`,
                        },
                    },
                },
                scales: {
                    x: { grid: { display: false }, border: { display: false } },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f1f5f9' },
                        border: { display: false },
                        ticks: { stepSize: 1 },
                    },
                },
            },
        });
    }

    /* -- Courses by level (doughnut) -- */
    const levelDoughnutCtx = document.getElementById('levelDoughnutChart');
    if (levelDoughnutCtx && chartData.coursesByLevel) {
        const levelColors = [PALETTE.green, PALETTE.yellow, PALETTE.red];
        new Chart(levelDoughnutCtx, {
            type: 'doughnut',
            data: {
                labels: chartData.coursesByLevel.labels,
                datasets: [{
                    data: chartData.coursesByLevel.data,
                    backgroundColor: levelColors,
                    borderWidth: 2,
                    borderColor: 'white',
                    hoverOffset: 4,
                }],
            },
            options: {
                responsive: true,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 14, usePointStyle: true, pointStyleWidth: 8 },
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        padding: 10,
                        cornerRadius: 8,
                    },
                },
            },
        });
    }

    /* -- Courses by status (pie) -- */
    const statusPieCtx = document.getElementById('statusPieChart');
    if (statusPieCtx && chartData.coursesByStatus) {
        new Chart(statusPieCtx, {
            type: 'pie',
            data: {
                labels: chartData.coursesByStatus.labels,
                datasets: [{
                    data: chartData.coursesByStatus.data,
                    backgroundColor: [PALETTE.green, '#94a3b8', PALETTE.orange],
                    borderWidth: 2,
                    borderColor: 'white',
                    hoverOffset: 4,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 14, usePointStyle: true, pointStyleWidth: 8 },
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        padding: 10,
                        cornerRadius: 8,
                    },
                },
            },
        });
    }

})();
