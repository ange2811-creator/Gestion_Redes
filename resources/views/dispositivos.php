<?php
$pageTitle = 'Dispositivos';
$activePage = 'dispositivos';
require __DIR__ . '/layout/header.php';
?>
<section class="page-heading">
    <div>
        <p class="eyebrow">INVENTARIO</p>
        <h1>Dispositivos</h1>
        <p class="page-subtitle">Administra los equipos conectados a tu red.</p>
    </div>
    <button id="newDeviceButton" class="button button-primary" type="button"><i class="bi bi-plus-lg button-symbol" aria-hidden="true"></i> Registrar dispositivo</button>
</section>

<div id="devicesNotice" class="notice" role="status" hidden></div>

<section class="metric-grid compact-metrics" aria-label="Resumen de dispositivos">
    <article class="metric-card"><div class="metric-label">Total</div><div id="deviceMetricTotal" class="metric-value small-value">—</div></article>
    <article class="metric-card"><div class="metric-label">En línea</div><div id="deviceMetricOnline" class="metric-value small-value">—</div></article>
    <article class="metric-card"><div class="metric-label">Fuera de línea</div><div id="deviceMetricOffline" class="metric-value small-value">—</div></article>
    <article class="metric-card"><div class="metric-label">Advertencias</div><div id="deviceMetricWarning" class="metric-value small-value">—</div></article>
</section>

<section class="panel">
    <div class="panel-heading panel-toolbar">
        <div><h2>Todos los dispositivos</h2><p id="deviceTableSummary">Inventario de equipos</p></div>
        <label class="search-box">
            <i class="bi bi-search" aria-hidden="true"></i>
            <input id="deviceSearch" type="search" placeholder="Buscar por nombre, IP o ubicación" aria-label="Buscar dispositivos">
        </label>
    </div>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Dispositivo</th><th>Dirección IP</th><th>Tipo</th><th>Ubicación</th><th>Estado</th><th>Último monitoreo</th><th><span class="sr-only">Acciones</span></th></tr></thead>
            <tbody id="devicesTable"><tr><td colspan="7" class="table-message">Cargando dispositivos…</td></tr></tbody>
        </table>
    </div>
</section>

<dialog id="deviceDialog" class="form-dialog">
    <form id="deviceForm" class="dialog-card">
        <div class="dialog-heading">
            <div><p class="eyebrow">INVENTARIO</p><h2 id="deviceDialogTitle">Registrar dispositivo</h2></div>
            <button id="closeDeviceDialog" class="icon-button" type="button" aria-label="Cerrar">×</button>
        </div>
        <input id="deviceId" type="hidden">
        <div class="form-grid">
            <label class="field field-wide">Nombre del dispositivo<input id="deviceName" name="nombre" required maxlength="120" placeholder="Ej. Router principal"></label>
            <label class="field">Dirección IP<input id="deviceIp" name="ip" required placeholder="192.168.1.1"></label>
            <label class="field">Dirección MAC <span class="optional">(opcional)</span><input id="deviceMac" name="mac" placeholder="00:1A:2B:3C:4D:5E"></label>
            <label class="field">Tipo
                <select id="deviceType" name="tipo">
                    <option value="Router">Router</option><option value="Switch">Switch</option>
                    <option value="Servidor">Servidor</option><option value="Firewall">Firewall</option>
                    <option value="Punto de acceso">Punto de acceso</option><option value="Otro">Otro</option>
                </select>
            </label>
            <label class="field">Estado
                <select id="deviceStatus" name="estado">
                    <option value="desconocido">Desconocido</option><option value="en_linea">En línea</option>
                    <option value="fuera_de_linea">Fuera de línea</option><option value="advertencia">Advertencia</option>
                </select>
            </label>
            <label class="field field-wide">Ubicación <span class="optional">(opcional)</span><input id="deviceLocation" name="ubicacion" maxlength="160" placeholder="Ej. Sala de servidores"></label>
        </div>
        <div id="deviceFormError" class="form-error" role="alert" hidden></div>
        <div class="dialog-actions">
            <button id="cancelDeviceDialog" class="button button-secondary" type="button">Cancelar</button>
            <button id="saveDeviceButton" class="button button-primary" type="submit">Guardar dispositivo</button>
        </div>
    </form>
</dialog>
<?php require __DIR__ . '/layout/footer.php'; ?>
