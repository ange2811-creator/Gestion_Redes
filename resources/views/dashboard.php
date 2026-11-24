<?php
$pageTitle = 'Panel principal';
$activePage = 'dashboard';
require __DIR__ . '/layout/header.php';
?>
<section class="page-heading">
    <div>
        <p class="eyebrow">VISTA GENERAL</p>
        <h1>Panel principal</h1>
        <p class="page-subtitle">Estado y actividad reciente de tu infraestructura de red.</p>
    </div>
    <a class="button button-primary" href="/dispositivos"><i class="bi bi-plus-lg button-symbol" aria-hidden="true"></i> Añadir dispositivo</a>
</section>

<div id="dashboardNotice" class="notice" role="status" hidden></div>

<section class="metric-grid" aria-label="Métricas de la red">
    <article class="metric-card">
        <div class="metric-top"><span class="metric-label">Dispositivos registrados</span><span class="metric-icon icon-blue"><i class="bi bi-hdd-network"></i></span></div>
        <div id="metricDevices" class="metric-value">—</div>
        <div class="metric-foot"><span class="metric-foot-dot blue-dot"></span> Inventario de red</div>
    </article>
    <article class="metric-card">
        <div class="metric-top"><span class="metric-label">En línea</span><span class="metric-icon icon-green"><i class="bi bi-wifi"></i></span></div>
        <div id="metricOnline" class="metric-value">—</div>
        <div class="metric-foot"><span class="metric-foot-dot green-dot"></span> Conectividad confirmada</div>
    </article>
    <article class="metric-card">
        <div class="metric-top"><span class="metric-label">Fuera de línea</span><span class="metric-icon icon-red"><i class="bi bi-wifi-off"></i></span></div>
        <div id="metricOffline" class="metric-value">—</div>
        <div class="metric-foot"><span class="metric-foot-dot red-dot"></span> Requieren atención</div>
    </article>
    <article class="metric-card">
        <div class="metric-top"><span class="metric-label">Incidencias abiertas</span><span class="metric-icon icon-orange"><i class="bi bi-exclamation-triangle"></i></span></div>
        <div id="metricIncidents" class="metric-value">—</div>
        <div class="metric-foot"><span class="metric-foot-dot orange-dot"></span> Pendientes de resolución</div>
    </article>
</section>

<section class="content-grid dashboard-grid">
    <article class="panel">
        <div class="panel-heading">
            <div><h2>Dispositivos</h2><p>Estado actual de los equipos registrados</p></div>
            <a class="text-link" href="/dispositivos">Ver todos <span aria-hidden="true">→</span></a>
        </div>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Dispositivo</th><th>Ubicación</th><th>Estado</th><th>Último monitoreo</th></tr></thead>
                <tbody id="dashboardDevices"><tr><td colspan="4" class="table-message">Cargando dispositivos…</td></tr></tbody>
            </table>
        </div>
    </article>
    <article class="panel">
        <div class="panel-heading">
            <div><h2>Incidencias recientes</h2><p>Seguimiento de eventos reportados</p></div>
            <a class="text-link" href="/incidencias">Ver todas <span aria-hidden="true">→</span></a>
        </div>
        <div id="dashboardIncidents" class="activity-list">
            <div class="table-message">Cargando incidencias…</div>
        </div>
    </article>
</section>
<?php require __DIR__ . '/layout/footer.php'; ?>
