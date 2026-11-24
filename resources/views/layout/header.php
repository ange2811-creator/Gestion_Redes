<?php
$pageTitle = $pageTitle ?? $titulo ?? 'Gestión de Red';
$activePage = $activePage ?? '';
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f5f7fb">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?> | NetOps</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/app.css">
    <script src="/assets/js/main.js" defer></script>
</head>
<body>
<div class="app-shell">
    <aside class="sidebar">
        <a class="brand" href="/" aria-label="NetOps, inicio">
            <span class="brand-mark">N</span>
            <span class="brand-copy"><strong>netops</strong><small>CONTROL DE RED</small></span>
        </a>
        <div class="nav-caption">MENÚ PRINCIPAL</div>
        <nav class="primary-nav" aria-label="Navegación principal">
            <a class="<?= $activePage === 'dashboard' ? 'active' : '' ?>" href="/">
                <span class="nav-icon"><i class="bi bi-speedometer2"></i></span><span>Resumen</span>
            </a>
            <a class="<?= $activePage === 'dispositivos' ? 'active' : '' ?>" href="/dispositivos">
                <span class="nav-icon"><i class="bi bi-hdd-network"></i></span><span>Dispositivos</span>
            </a>
            <a class="<?= $activePage === 'monitoreo' ? 'active' : '' ?>" href="/monitoreo">
                <span class="nav-icon"><i class="bi bi-activity"></i></span><span>Monitoreo</span>
            </a>
            <a class="<?= $activePage === 'incidencias' ? 'active' : '' ?>" href="/incidencias">
                <span class="nav-icon"><i class="bi bi-exclamation-triangle"></i></span><span>Incidencias</span>
            </a>
        </nav>
        <div class="sidebar-bottom">
            <div class="sidebar-note">
                <span class="note-dot"></span>
                <div><strong>Centro de control</strong><small>Gestión de red local</small></div>
            </div>
            <span class="sidebar-version">NETOPS · PANEL DE RED</span>
        </div>
    </aside>

    <div class="main-column">
        <header class="topbar">
            <div class="breadcrumb"><span>NetOps</span><span class="breadcrumb-separator">/</span><strong><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></strong></div>
            <div class="topbar-meta">
                <span id="apiHealthBadge" class="health-pill"><span class="health-dot"></span> Comprobando servicio</span>
                <span class="avatar" aria-label="Usuario">AN</span>
            </div>
        </header>
        <main class="page-content">
