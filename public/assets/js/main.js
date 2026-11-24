function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[character]);
}

async function apiRequest(url, options = {}) {
    const requestOptions = { method: options.method || 'GET', headers: { Accept: 'application/json' } };
    if (options.body !== undefined) {
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.body = JSON.stringify(options.body);
    }

    let response;
    try {
        response = await fetch(url, requestOptions);
    } catch (error) {
        throw new Error('No fue posible conectar con la API. Comprueba que el servidor esté activo.');
    }

    let payload;
    try {
        payload = await response.json();
    } catch (error) {
        throw new Error(`La API devolvió una respuesta no válida (HTTP ${response.status}).`);
    }

    if (!response.ok || payload.success === false) {
        const detail = payload.exception?.[0]?.message;
        throw new Error(detail || payload.message || `La solicitud falló (HTTP ${response.status}).`);
    }
    return payload.success === true ? payload.data : payload;
}

function showNotice(element, message, type = 'error') {
    if (!element) return;
    element.textContent = message;
    element.className = `notice${type === 'success' ? ' notice-success' : ' notice-error'}`;
    element.hidden = false;
}

function clearNotice(element) {
    if (element) element.hidden = true;
}

function formatDate(value) {
    if (!value) return 'Sin registro';
    const date = new Date(String(value).replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return escapeHtml(value);
    return new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function stateLabel(state) {
    return ({
        en_linea: 'En línea',
        fuera_de_linea: 'Fuera de línea',
        advertencia: 'Advertencia',
        desconocido: 'Desconocido'
    })[state] || 'Desconocido';
}

function stateBadge(state) {
    const className = ({
        en_linea: 'status-online',
        fuera_de_linea: 'status-offline',
        advertencia: 'status-warning',
        desconocido: 'status-unknown'
    })[state] || 'status-unknown';
    return `<span class="status-badge ${className}">${stateLabel(state)}</span>`;
}

function severityBadge(severity) {
    const labels = { baja: 'Baja', media: 'Media', alta: 'Alta', critica: 'Crítica' };
    const classes = { baja: 'severity-low', media: 'severity-medium', alta: 'severity-high', critica: 'severity-critical' };
    return `<span class="severity-badge ${classes[severity] || 'severity-low'}">${labels[severity] || escapeHtml(severity)}</span>`;
}

function incidentStateLabel(state) {
    return ({ abierta: 'Abierta', en_proceso: 'En proceso', resuelta: 'Resuelta' })[state] || escapeHtml(state);
}

function updateHealthBadge() {
    const badge = document.getElementById('apiHealthBadge');
    if (!badge) return;
    apiRequest('/api/health').then((health) => {
        const connected = health.status === 'online' && health.database && health.database.connected;
        badge.className = `health-pill ${connected ? 'health-ok' : 'health-warning'}`;
        badge.innerHTML = `<span class="health-dot"></span>${connected ? 'API y base de datos' : 'Base de datos desconectada'}`;
        if (!connected && health.database?.message) badge.title = health.database.message;
    }).catch(() => {
        badge.className = 'health-pill health-error';
        badge.innerHTML = '<span class="health-dot"></span> API inalcanzable';
    });
}

async function initDashboard() {
    const notice = document.getElementById('dashboardNotice');
    const deviceBody = document.getElementById('dashboardDevices');
    const incidentList = document.getElementById('dashboardIncidents');
    try {
        const [deviceMetrics, incidentMetrics, devices, incidents] = await Promise.all([
            apiRequest('/api/dispositivos/metricas'),
            apiRequest('/api/incidencias/metricas'),
            apiRequest('/api/dispositivos'),
            apiRequest('/api/incidencias')
        ]);
        document.getElementById('metricDevices').textContent = deviceMetrics.total ?? 0;
        document.getElementById('metricOnline').textContent = deviceMetrics.en_linea ?? 0;
        document.getElementById('metricOffline').textContent = deviceMetrics.fuera_de_linea ?? 0;
        document.getElementById('metricIncidents').textContent = incidentMetrics.abiertas ?? 0;

        deviceBody.innerHTML = devices.length ? devices.slice(0, 6).map((device) => `
            <tr>
                <td><span class="device-name">${escapeHtml(device.nombre)}</span><span class="device-sub">${escapeHtml(device.ip)}</span></td>
                <td>${escapeHtml(device.ubicacion || '—')}</td>
                <td>${stateBadge(device.estado)}</td>
                <td>${escapeHtml(formatDate(device.ultimo_monitoreo))}</td>
            </tr>`).join('') : '<tr><td colspan="4" class="table-message">Aún no hay dispositivos registrados.</td></tr>';

        incidentList.innerHTML = incidents.length ? incidents.slice(0, 5).map((incident) => `
            <div class="activity-item">
                <span class="activity-mark" aria-hidden="true">△</span>
                <div class="activity-copy"><strong>${escapeHtml(incident.titulo)}</strong><small>${escapeHtml(incident.dispositivo_nombre || `Dispositivo #${incident.dispositivo_id}`)} · ${escapeHtml(formatDate(incident.fecha_reporte))}</small></div>
                ${severityBadge(incident.gravedad)}
            </div>`).join('') : '<div class="table-message">No hay incidencias registradas.</div>';
    } catch (error) {
        showNotice(notice, error.message);
        deviceBody.innerHTML = '<tr><td colspan="4" class="table-message">No se pudieron cargar los dispositivos.</td></tr>';
        incidentList.innerHTML = '<div class="table-message">No se pudieron cargar las incidencias.</div>';
    }
}

async function initDevices() {
    const notice = document.getElementById('devicesNotice');
    const table = document.getElementById('devicesTable');
    const dialog = document.getElementById('deviceDialog');
    const form = document.getElementById('deviceForm');
    const formError = document.getElementById('deviceFormError');
    let devices = [];

    const renderDevices = () => {
        const query = document.getElementById('deviceSearch').value.trim().toLocaleLowerCase();
        const filtered = devices.filter((device) => [device.nombre, device.ip, device.ubicacion, device.tipo]
            .some((value) => String(value || '').toLocaleLowerCase().includes(query)));
        document.getElementById('deviceTableSummary').textContent = `${filtered.length} ${filtered.length === 1 ? 'dispositivo' : 'dispositivos'}`;
        table.innerHTML = filtered.length ? filtered.map((device) => `
            <tr>
                <td><span class="device-name">${escapeHtml(device.nombre)}</span><span class="device-sub">ID #${escapeHtml(device.id)}</span></td>
                <td>${escapeHtml(device.ip)}</td>
                <td>${escapeHtml(device.tipo || 'Otro')}</td>
                <td>${escapeHtml(device.ubicacion || '—')}</td>
                <td>${stateBadge(device.estado)}</td>
                <td>${escapeHtml(formatDate(device.ultimo_monitoreo))}</td>
                <td><div class="row-actions">
                    <button class="icon-button" type="button" data-edit-device="${escapeHtml(device.id)}" aria-label="Editar ${escapeHtml(device.nombre)}" title="Editar">✎</button>
                    <button class="icon-button danger" type="button" data-delete-device="${escapeHtml(device.id)}" aria-label="Eliminar ${escapeHtml(device.nombre)}" title="Eliminar">×</button>
                </div></td>
            </tr>`).join('') : `<tr><td colspan="7" class="table-message">${devices.length ? 'No hay resultados para la búsqueda.' : 'Aún no hay dispositivos registrados.'}</td></tr>`;
    };

    const loadDevices = async () => {
        devices = await apiRequest('/api/dispositivos');
        renderDevices();
        const metrics = await apiRequest('/api/dispositivos/metricas');
        document.getElementById('deviceMetricTotal').textContent = metrics.total ?? 0;
        document.getElementById('deviceMetricOnline').textContent = metrics.en_linea ?? 0;
        document.getElementById('deviceMetricOffline').textContent = metrics.fuera_de_linea ?? 0;
        document.getElementById('deviceMetricWarning').textContent = metrics.advertencia ?? 0;
    };

    const openForm = (device = null) => {
        form.reset();
        formError.hidden = true;
        document.getElementById('deviceId').value = device?.id || '';
        document.getElementById('deviceName').value = device?.nombre || '';
        document.getElementById('deviceIp').value = device?.ip || '';
        document.getElementById('deviceMac').value = device?.mac || '';
        document.getElementById('deviceType').value = device?.tipo || 'Otro';
        document.getElementById('deviceStatus').value = device?.estado || 'desconocido';
        document.getElementById('deviceLocation').value = device?.ubicacion || '';
        document.getElementById('deviceDialogTitle').textContent = device ? 'Editar dispositivo' : 'Registrar dispositivo';
        document.getElementById('saveDeviceButton').textContent = device ? 'Guardar cambios' : 'Guardar dispositivo';
        dialog.showModal();
    };

    document.getElementById('newDeviceButton').addEventListener('click', () => openForm());
    document.getElementById('closeDeviceDialog').addEventListener('click', () => dialog.close());
    document.getElementById('cancelDeviceDialog').addEventListener('click', () => dialog.close());
    document.getElementById('deviceSearch').addEventListener('input', renderDevices);
    table.addEventListener('click', async (event) => {
        const editButton = event.target.closest('[data-edit-device]');
        const deleteButton = event.target.closest('[data-delete-device]');
        if (editButton) {
            const device = devices.find((entry) => String(entry.id) === editButton.dataset.editDevice);
            if (device) openForm(device);
        }
        if (deleteButton) {
            const device = devices.find((entry) => String(entry.id) === deleteButton.dataset.deleteDevice);
            if (!device || !window.confirm(`¿Eliminar el dispositivo "${device.nombre}"?`)) return;
            try {
                await apiRequest(`/api/dispositivos/${device.id}`, { method: 'DELETE' });
                showNotice(notice, 'Dispositivo eliminado correctamente.', 'success');
                await loadDevices();
            } catch (error) {
                showNotice(notice, error.message);
            }
        }
    });
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        formError.hidden = true;
        const id = document.getElementById('deviceId').value;
        const body = Object.fromEntries(new FormData(form).entries());
        try {
            await apiRequest(id ? `/api/dispositivos/${id}` : '/api/dispositivos', {
                method: id ? 'PUT' : 'POST',
                body
            });
            dialog.close();
            showNotice(notice, id ? 'Dispositivo actualizado correctamente.' : 'Dispositivo registrado correctamente.', 'success');
            await loadDevices();
        } catch (error) {
            formError.textContent = error.message;
            formError.hidden = false;
        }
    });

    try {
        await loadDevices();
    } catch (error) {
        table.innerHTML = '<tr><td colspan="7" class="table-message">No se pudieron cargar los dispositivos.</td></tr>';
        showNotice(notice, error.message);
    }
}

async function initMonitoring() {
    const notice = document.getElementById('monitorNotice');
    const grid = document.getElementById('monitorDeviceGrid');
    const historyBody = document.getElementById('monitorHistory');
    let devices = [];

    const loadHistory = async () => {
        const entries = await apiRequest('/api/monitoreo/historial?limit=20');
        historyBody.innerHTML = entries.length ? entries.map((entry) => `
            <tr>
                <td><span class="device-name">${escapeHtml(entry.dispositivo_nombre || `Dispositivo #${entry.dispositivo_id}`)}</span></td>
                <td>${escapeHtml(entry.dispositivo_ip || '—')}</td>
                <td>${stateBadge(entry.estado)}</td>
                <td>${entry.latencia_ms == null ? '—' : `${escapeHtml(entry.latencia_ms)} ms`}</td>
                <td>${escapeHtml(formatDate(entry.fecha || entry.created_at))}</td>
                <td>${escapeHtml(entry.detalles || '—')}</td>
            </tr>`).join('') : '<tr><td colspan="6" class="table-message">No hay comprobaciones en el historial.</td></tr>';
    };

    const renderDevices = () => {
        grid.innerHTML = devices.length ? devices.map((device) => `
            <article class="monitor-card">
                <div class="monitor-card-top">
                    <div><h3>${escapeHtml(device.nombre)}</h3><span class="monitor-ip">${escapeHtml(device.ip)}</span></div>
                    ${stateBadge(device.estado)}
                </div>
                <div class="monitor-meta"><span>${escapeHtml(device.tipo || 'Otro')}</span><span>Último: ${escapeHtml(formatDate(device.ultimo_monitoreo))}</span></div>
                <button class="button button-secondary" type="button" data-ping-device="${escapeHtml(device.id)}">Comprobar conexión</button>
            </article>`).join('') : '<div class="table-message">No hay dispositivos para monitorear.</div>';
    };

    grid.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-ping-device]');
        if (!button) return;
        button.disabled = true;
        button.textContent = 'Comprobando…';
        clearNotice(notice);
        try {
            const result = await apiRequest(`/api/monitoreo/ping/${button.dataset.pingDevice}`, { method: 'POST' });
            showNotice(notice, `${result.nombre}: ${stateLabel(result.estado)}${result.latencia_ms == null ? '' : ` · ${result.latencia_ms} ms`}`, 'success');
            document.getElementById('monitorLastUpdated').textContent = `Última comprobación: ${formatDate(result.fecha)}`;
            await refresh();
        } catch (error) {
            showNotice(notice, error.message);
        } finally {
            button.disabled = false;
            button.textContent = 'Comprobar conexión';
        }
    });

    const refresh = async () => {
        const [deviceList] = await Promise.all([
            apiRequest('/api/dispositivos'),
            loadHistory()
        ]);
        devices = deviceList;
        renderDevices();
    };

    document.getElementById('refreshHistoryButton').addEventListener('click', async () => {
        try {
            await loadHistory();
            showNotice(notice, 'Historial actualizado.', 'success');
        } catch (error) {
            showNotice(notice, error.message);
        }
    });
    document.getElementById('pingAllButton').addEventListener('click', async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        button.textContent = 'Comprobando red…';
        clearNotice(notice);
        try {
            const result = await apiRequest('/api/monitoreo/ping-all', { method: 'POST' });
            const total = result.total_verificados ?? result.dispositivos?.length ?? 0;
            showNotice(notice, `Comprobación completada: ${total} ${total === 1 ? 'dispositivo verificado' : 'dispositivos verificados'}.`, 'success');
            document.getElementById('monitorLastUpdated').textContent = `Última comprobación: ${formatDate(new Date().toISOString())}`;
            await refresh();
        } catch (error) {
            showNotice(notice, error.message);
        } finally {
            button.disabled = false;
            button.innerHTML = '<i class="bi bi-arrow-repeat button-symbol" aria-hidden="true"></i> Monitorear toda la red';
        }
    });

    try {
        await refresh();
    } catch (error) {
        grid.innerHTML = '<div class="table-message">No se pudieron cargar los dispositivos.</div>';
        historyBody.innerHTML = '<tr><td colspan="6" class="table-message">No se pudo cargar el historial.</td></tr>';
        showNotice(notice, error.message);
    }
}

async function initIncidents() {
    const notice = document.getElementById('incidentsNotice');
    const table = document.getElementById('incidentsTable');
    const dialog = document.getElementById('incidentDialog');
    const form = document.getElementById('incidentForm');
    const formError = document.getElementById('incidentFormError');
    let incidents = [];

    const renderIncidents = () => {
        const query = document.getElementById('incidentSearch').value.trim().toLocaleLowerCase();
        const filtered = incidents.filter((incident) => [
            incident.titulo, incident.descripcion, incident.dispositivo_nombre,
            incident.dispositivo_ip, incident.estado, incident.gravedad
        ].some((value) => String(value || '').toLocaleLowerCase().includes(query)));
        table.innerHTML = filtered.length ? filtered.map((incident) => `
            <tr>
                <td><span class="device-name">${escapeHtml(incident.titulo)}</span><span class="device-sub">${escapeHtml(incident.descripcion)}</span></td>
                <td><span class="device-name">${escapeHtml(incident.dispositivo_nombre || `Dispositivo #${incident.dispositivo_id}`)}</span><span class="device-sub">${escapeHtml(incident.dispositivo_ip || '')}</span></td>
                <td>${severityBadge(incident.gravedad)}</td>
                <td><label class="sr-only" for="incident-state-${escapeHtml(incident.id)}">Estado de ${escapeHtml(incident.titulo)}</label>
                    <select class="inline-select" id="incident-state-${escapeHtml(incident.id)}" data-incident-state="${escapeHtml(incident.id)}">
                        ${['abierta', 'en_proceso', 'resuelta'].map((state) => `<option value="${state}" ${incident.estado === state ? 'selected' : ''}>${incidentStateLabel(state)}</option>`).join('')}
                    </select>
                </td>
                <td>${escapeHtml(formatDate(incident.fecha_reporte))}</td>
            </tr>`).join('') : `<tr><td colspan="5" class="table-message">${incidents.length ? 'No hay resultados para la búsqueda.' : 'No hay incidencias registradas.'}</td></tr>`;
    };

    const loadIncidents = async () => {
        const [incidentList, metrics] = await Promise.all([
            apiRequest('/api/incidencias'),
            apiRequest('/api/incidencias/metricas')
        ]);
        incidents = incidentList;
        document.getElementById('incidentMetricTotal').textContent = metrics.total ?? 0;
        document.getElementById('incidentMetricOpen').textContent = metrics.abiertas ?? 0;
        document.getElementById('incidentMetricProgress').textContent = metrics.en_proceso ?? 0;
        document.getElementById('incidentMetricResolved').textContent = metrics.resueltas ?? 0;
        renderIncidents();
    };

    const loadDevices = async () => {
        const devices = await apiRequest('/api/dispositivos');
        document.getElementById('incidentDevice').innerHTML = '<option value="">Selecciona un dispositivo</option>' +
            devices.map((device) => `<option value="${escapeHtml(device.id)}">${escapeHtml(device.nombre)} — ${escapeHtml(device.ip)}</option>`).join('');
    };

    document.getElementById('newIncidentButton').addEventListener('click', () => {
        form.reset();
        formError.hidden = true;
        dialog.showModal();
    });
    document.getElementById('closeIncidentDialog').addEventListener('click', () => dialog.close());
    document.getElementById('cancelIncidentDialog').addEventListener('click', () => dialog.close());
    document.getElementById('incidentSearch').addEventListener('input', renderIncidents);

    table.addEventListener('change', async (event) => {
        const select = event.target.closest('[data-incident-state]');
        if (!select) return;
        const incident = incidents.find((entry) => String(entry.id) === select.dataset.incidentState);
        if (!incident || select.value === incident.estado) return;
        select.disabled = true;
        try {
            await apiRequest(`/api/incidencias/${incident.id}/estado`, {
                method: 'PATCH',
                body: { estado: select.value }
            });
            showNotice(notice, 'Estado de incidencia actualizado.', 'success');
            await loadIncidents();
        } catch (error) {
            showNotice(notice, error.message);
            select.value = incident.estado;
        } finally {
            select.disabled = false;
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        formError.hidden = true;
        const body = Object.fromEntries(new FormData(form).entries());
        try {
            await apiRequest('/api/incidencias', { method: 'POST', body });
            dialog.close();
            showNotice(notice, 'Incidencia reportada correctamente.', 'success');
            await loadIncidents();
        } catch (error) {
            formError.textContent = error.message;
            formError.hidden = false;
        }
    });

    try {
        await Promise.all([loadIncidents(), loadDevices()]);
    } catch (error) {
        table.innerHTML = '<tr><td colspan="5" class="table-message">No se pudieron cargar las incidencias.</td></tr>';
        showNotice(notice, error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateHealthBadge();
    if (document.getElementById('dashboardDevices')) initDashboard();
    if (document.getElementById('devicesTable')) initDevices();
    if (document.getElementById('monitorDeviceGrid')) initMonitoring();
    if (document.getElementById('incidentsTable')) initIncidents();
});
