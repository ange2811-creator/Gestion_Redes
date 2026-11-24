<?php
$pageTitle = 'Incidencias';
$activePage = 'incidencias';
require __DIR__ . '/layout/header.php';
?>
<section class="page-heading">
    <div>
        <p class="eyebrow">SEGUIMIENTO</p>
        <h1>Incidencias</h1>
        <p class="page-subtitle">Registra anomalías y da seguimiento a su resolución.</p>
    </div>
    <button id="newIncidentButton" class="button button-primary" type="button"><i class="bi bi-plus-lg button-symbol" aria-hidden="true"></i> Reportar incidencia</button>
</section>

<div id="incidentsNotice" class="notice" role="status" hidden></div>

<section class="metric-grid compact-metrics" aria-label="Resumen de incidencias">
    <article class="metric-card"><div class="metric-label">Total</div><div id="incidentMetricTotal" class="metric-value small-value">—</div></article>
    <article class="metric-card"><div class="metric-label">Abiertas</div><div id="incidentMetricOpen" class="metric-value small-value">—</div></article>
    <article class="metric-card"><div class="metric-label">En proceso</div><div id="incidentMetricProgress" class="metric-value small-value">—</div></article>
    <article class="metric-card"><div class="metric-label">Resueltas</div><div id="incidentMetricResolved" class="metric-value small-value">—</div></article>
</section>

<section class="panel">
    <div class="panel-heading panel-toolbar">
        <div><h2>Registro de incidencias</h2><p>Filtra y actualiza el estado de cada reporte.</p></div>
        <label class="search-box">
            <i class="bi bi-search" aria-hidden="true"></i>
            <input id="incidentSearch" type="search" placeholder="Buscar incidencia o dispositivo" aria-label="Buscar incidencias">
        </label>
    </div>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Incidencia</th><th>Dispositivo</th><th>Gravedad</th><th>Estado</th><th>Fecha de reporte</th></tr></thead>
            <tbody id="incidentsTable"><tr><td colspan="5" class="table-message">Cargando incidencias…</td></tr></tbody>
        </table>
    </div>
</section>

<dialog id="incidentDialog" class="form-dialog">
    <form id="incidentForm" class="dialog-card">
        <div class="dialog-heading">
            <div><p class="eyebrow">NUEVO REPORTE</p><h2>Reportar incidencia</h2></div>
            <button id="closeIncidentDialog" class="icon-button" type="button" aria-label="Cerrar">×</button>
        </div>
        <div class="form-grid">
            <label class="field field-wide">Dispositivo afectado
                <select id="incidentDevice" name="dispositivo_id" required><option value="">Selecciona un dispositivo</option></select>
            </label>
            <label class="field field-wide">Título<input id="incidentTitle" name="titulo" required maxlength="160" placeholder="Resume el problema"></label>
            <label class="field">Gravedad
                <select id="incidentSeverity" name="gravedad">
                    <option value="baja">Baja</option><option value="media" selected>Media</option>
                    <option value="alta">Alta</option><option value="critica">Crítica</option>
                </select>
            </label>
            <label class="field field-wide">Descripción<textarea id="incidentDescription" name="descripcion" rows="4" required placeholder="Describe qué ocurrió y cualquier dato útil"></textarea></label>
        </div>
        <div id="incidentFormError" class="form-error" role="alert" hidden></div>
        <div class="dialog-actions">
            <button id="cancelIncidentDialog" class="button button-secondary" type="button">Cancelar</button>
            <button id="saveIncidentButton" class="button button-primary" type="submit">Crear reporte</button>
        </div>
    </form>
</dialog>
<?php require __DIR__ . '/layout/footer.php'; ?>
