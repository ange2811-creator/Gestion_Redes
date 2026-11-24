<?php
$pageTitle = 'Monitoreo en tiempo real';
$activePage = 'monitoreo';
require __DIR__ . '/layout/header.php';
?>
<section class="page-heading">
    <div>
        <p class="eyebrow">CONECTIVIDAD</p>
        <h1>Monitoreo en tiempo real</h1>
        <p class="page-subtitle">Comprueba la disponibilidad y latencia de los equipos de tu red.</p>
    </div>
    <button id="pingAllButton" class="button button-primary" type="button"><i class="bi bi-arrow-repeat button-symbol" aria-hidden="true"></i> Monitorear toda la red</button>
</section>

<div id="monitorNotice" class="notice" role="status" hidden></div>

<section class="panel">
    <div class="panel-heading">
        <div><h2>Dispositivos de red</h2><p>Ejecuta una comprobación individual o revisa el estado general.</p></div>
        <span id="monitorLastUpdated" class="muted-label">Sin comprobaciones recientes</span>
    </div>
    <div id="monitorDeviceGrid" class="device-grid">
        <div class="table-message">Cargando dispositivos…</div>
    </div>
</section>

<section class="panel section-gap">
    <div class="panel-heading">
        <div><h2>Historial de monitoreo</h2><p>Últimas comprobaciones registradas para la red.</p></div>
        <button id="refreshHistoryButton" class="button button-secondary button-small" type="button"><i class="bi bi-arrow-clockwise"></i> Actualizar historial</button>
    </div>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Dispositivo</th><th>Dirección IP</th><th>Estado</th><th>Latencia</th><th>Fecha</th><th>Detalles</th></tr></thead>
            <tbody id="monitorHistory"><tr><td colspan="6" class="table-message">Cargando historial…</td></tr></tbody>
        </table>
    </div>
</section>
<?php require __DIR__ . '/layout/footer.php'; ?>
