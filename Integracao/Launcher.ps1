# Launcher MuBanneD 5.2 - botao INICIAR abre SQL, servidores e o jogo (via Abrir-Jogo.ps1)
Add-Type -AssemblyName System.Windows.Forms, System.Drawing
[Windows.Forms.Application]::EnableVisualStyles()
$I = $PSScriptRoot
$client = Join-Path (Split-Path -Parent $I) '2 - Cliente'
$pref = 'HKCU:\Software\MuBanneD'; if (-not (Test-Path $pref)) { New-Item $pref -Force | Out-Null }
$OURO = [Drawing.Color]::FromArgb(232, 184, 74); $OURO2 = [Drawing.Color]::FromArgb(150, 105, 30)
$RUBI = [Drawing.Color]::FromArgb(170, 14, 32); $RUBI2 = [Drawing.Color]::FromArgb(60, 4, 10)
$PRETO = [Drawing.Color]::FromArgb(12, 8, 8)

$f = New-Object Windows.Forms.Form
$f.Text = 'MuBanneD 5.2'; $f.Size = '900,560'; $f.StartPosition = 'CenterScreen'; $f.FormBorderStyle = 'None'; $f.BackColor = $PRETO
try { $f.Icon = New-Object Drawing.Icon (Join-Path $I 'logo\banned.ico') } catch {}
$logo = $null; try { $logo = [Drawing.Image]::FromFile((Join-Path $I 'logo\logo-oficial.png')) } catch {}
$f.GetType().GetProperty('DoubleBuffered', [Reflection.BindingFlags]'Instance,NonPublic').SetValue($f, $true)

$f.Add_Paint({
    param($s, $e); $g = $e.Graphics; $g.SmoothingMode = 'AntiAlias'
    $r = $s.ClientRectangle
    $bg = New-Object Drawing.Drawing2D.LinearGradientBrush($r, $RUBI2, $PRETO, 90); $g.FillRectangle($bg, $r)
    # brilho rubi atras da logo
    $p = New-Object Drawing.Drawing2D.GraphicsPath; $p.AddEllipse(-60, 20, 560, 520)
    $pb = New-Object Drawing.Drawing2D.PathGradientBrush($p); $pb.CenterColor = [Drawing.Color]::FromArgb(150, $RUBI); $pb.SurroundColors = @([Drawing.Color]::FromArgb(0, $RUBI)); $g.FillPath($pb, $p)
    if ($logo) { $g.DrawImage($logo, 30, 50, 400, 400) }
    $pen = New-Object Drawing.Pen($OURO, 2); $g.DrawRectangle($pen, 1, 1, $r.Width - 3, $r.Height - 3)
    $pen2 = New-Object Drawing.Pen($OURO2, 1); $g.DrawRectangle($pen2, 6, 6, $r.Width - 13, $r.Height - 13)
})
# arrastar a janela
$script:drag = $null
$f.Add_MouseDown({ $script:drag = [Windows.Forms.Cursor]::Position })
$f.Add_MouseMove({ if ($script:drag -and $_.Button -eq 'Left') { $c = [Windows.Forms.Cursor]::Position; $f.Left += $c.X - $script:drag.X; $f.Top += $c.Y - $script:drag.Y; $script:drag = $c } })
$f.Add_MouseUp({ $script:drag = $null })

function Novo-Botao($txt, $x, $y, $w, $h, $tam) {
    $b = New-Object Windows.Forms.Button; $b.Text = $txt; $b.SetBounds($x, $y, $w, $h)
    $b.FlatStyle = 'Flat'; $b.FlatAppearance.BorderColor = $OURO; $b.FlatAppearance.BorderSize = 1
    $b.BackColor = $RUBI2; $b.ForeColor = $OURO; $b.Font = New-Object Drawing.Font('Georgia', $tam, [Drawing.FontStyle]::Bold)
    $b.FlatAppearance.MouseOverBackColor = $RUBI; $b.Cursor = 'Hand'; $f.Controls.Add($b); $b
}
function Novo-Texto($txt, $x, $y, $w, $h, $tam, $cor) {
    $l = New-Object Windows.Forms.Label; $l.Text = $txt; $l.SetBounds($x, $y, $w, $h); $l.BackColor = 'Transparent'
    $l.ForeColor = $cor; $l.Font = New-Object Drawing.Font('Georgia', $tam, [Drawing.FontStyle]::Bold); $f.Controls.Add($l); $l
}

$x = Novo-Botao 'X' 852 12 34 28 11; $x.Add_Click({ $f.Close() })
$m = Novo-Botao '_' 814 12 34 28 11; $m.Add_Click({ $f.WindowState = 'Minimized' })

# painel de novidades
$t = Novo-Texto 'NOVIDADES' 470 60 380 26 14 $OURO
$nov = New-Object Windows.Forms.Label; $nov.SetBounds(470, 92, 390, 170); $nov.BackColor = [Drawing.Color]::FromArgb(30, 6, 10); $nov.ForeColor = [Drawing.Color]::FromArgb(235, 220, 200)
$nov.Font = New-Object Drawing.Font('Segoe UI', 10); $nov.Padding = '10,8,10,8'; $nov.BorderStyle = 'FixedSingle'
$nov.Text = "> Linha BanneD: asas e sets nas cores da logo`r`n> Itens +15 com efeito transparente (pode desligar)`r`n> Editor de itens: tecla Z  |  Guild: tecla G`r`n> Ranking PvP semanal e /premio`r`n> EXP 2000-4000x, level max 600"
$f.Controls.Add($nov)

# opcoes de tela
$listaRes = @('800x600', '1024x768', '1280x960', '1366x768', '1600x900', '1920x1080')
$listaModo = @(@('SemBorda', 'Tela inteira sem borda'), @('Cheia', 'Tela cheia'), @('Janela', 'Janela'))
Novo-Texto 'Resolucao' 470 280 120 20 10 $OURO | Out-Null
$cbR = New-Object Windows.Forms.ComboBox; $cbR.DropDownStyle = 'DropDownList'; $cbR.SetBounds(470, 302, 185, 24); $cbR.BackColor = $RUBI2; $cbR.ForeColor = $OURO; $cbR.FlatStyle = 'Flat'
$listaRes | % { [void]$cbR.Items.Add($(if ($_ -eq '1024x768') { "$_ (mais FPS)" } else { $_ })) }
$uRes = (Get-ItemProperty $pref -Name Res -EA 0).Res; if (-not $uRes) { $uRes = '1024x768' }
$cbR.SelectedIndex = [Math]::Max(0, [array]::IndexOf($listaRes, $uRes)); $f.Controls.Add($cbR)
Novo-Texto 'Modo de tela' 675 280 150 20 10 $OURO | Out-Null
$cbM = New-Object Windows.Forms.ComboBox; $cbM.DropDownStyle = 'DropDownList'; $cbM.SetBounds(675, 302, 185, 24); $cbM.BackColor = $RUBI2; $cbM.ForeColor = $OURO; $cbM.FlatStyle = 'Flat'
$listaModo | % { [void]$cbM.Items.Add($_[1]) }
$uMod = (Get-ItemProperty $pref -Name Modo -EA 0).Modo; if (-not $uMod) { $uMod = 'SemBorda' }
$cbM.SelectedIndex = [Math]::Max(0, [array]::IndexOf(@($listaModo | % { $_[0] }), $uMod)); $f.Controls.Add($cbM)
$ck = New-Object Windows.Forms.CheckBox; $ck.Text = 'Itens +15 brilhantes'; $ck.SetBounds(470, 334, 390, 22); $ck.BackColor = 'Transparent'; $ck.ForeColor = $OURO; $ck.Font = New-Object Drawing.Font('Segoe UI', 9)
$tr = (Get-ItemProperty 'HKCU:\Software\Webzen\Mu\Config' -Name BanneDBrilho15 -EA 0).BanneDBrilho15; $ck.Checked = ($tr -ne '0'); $f.Controls.Add($ck)

# barra de progresso
$st = Novo-Texto 'Pronto para jogar' 470 362 390 20 9 ([Drawing.Color]::FromArgb(235, 220, 200))
$pg = New-Object Windows.Forms.Panel; $pg.SetBounds(470, 384, 390, 14); $pg.BackColor = [Drawing.Color]::FromArgb(40, 10, 12); $pg.BorderStyle = 'FixedSingle'; $f.Controls.Add($pg)
$pgf = New-Object Windows.Forms.Panel; $pgf.SetBounds(0, 0, 0, 14); $pgf.BackColor = $OURO; $pg.Controls.Add($pgf)

# BOTAO INICIAR (grande, quadrado, pulsando)
$go = New-Object Windows.Forms.Button; $go.SetBounds(560, 410, 210, 110); $go.Text = 'INICIAR'
$go.FlatStyle = 'Flat'; $go.FlatAppearance.BorderSize = 0; $go.BackColor = $PRETO; $go.ForeColor = [Drawing.Color]::White; $go.Cursor = 'Hand'
$go.Font = New-Object Drawing.Font('Georgia', 26, [Drawing.FontStyle]::Bold)
$gp = New-Object Drawing.Drawing2D.GraphicsPath; $go.Region = $null
$script:pulso = 0; $script:sobre = $false
$go.Add_MouseEnter({ $script:sobre = $true; $go.Invalidate() }); $go.Add_MouseLeave({ $script:sobre = $false; $go.Invalidate() })
$go.Add_Paint({
    param($s, $e); $g = $e.Graphics; $g.SmoothingMode = 'AntiAlias'; $g.TextRenderingHint = 'AntiAliasGridFit'
    $a = [int](128 + 127 * [Math]::Sin($script:pulso))
    $c1 = if ($script:sobre) { [Drawing.Color]::FromArgb(230, 30, 50) } else { $RUBI }
    $b = New-Object Drawing.Drawing2D.LinearGradientBrush($s.ClientRectangle, $c1, $RUBI2, 90); $g.FillRectangle($b, 0, 0, 210, 110)
    $g.DrawRectangle((New-Object Drawing.Pen([Drawing.Color]::FromArgb($a, 255, 215, 90), 6)), 3, 3, 203, 103)
    $g.DrawRectangle((New-Object Drawing.Pen($OURO2, 2)), 10, 10, 189, 89)
    $sf = New-Object Drawing.StringFormat; $sf.Alignment = 'Center'; $sf.LineAlignment = 'Center'
    $g.DrawString($s.Text, $s.Font, (New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(90, 0, 0, 0))), (New-Object Drawing.RectangleF(2, 3, 210, 110)), $sf)
    $g.DrawString($s.Text, $s.Font, (New-Object Drawing.SolidBrush($(if ($s.Enabled) { [Drawing.Color]::FromArgb(255, 236, 170) } else { [Drawing.Color]::Gray }))), (New-Object Drawing.RectangleF(0, 0, 210, 110)), $sf)
})
$f.Controls.Add($go)
$tm = New-Object Windows.Forms.Timer; $tm.Interval = 50; $tm.Add_Tick({ $script:pulso += 0.15; $go.Invalidate() }); $tm.Start()

$bp = Novo-Botao 'PRINTS' 470 440 80 30 9; $bp.Add_Click({ $d = Join-Path $client 'ScreenShots'; if (-not (Test-Path $d)) { New-Item $d -ItemType Directory | Out-Null }; Start-Process explorer $d })
$bs = Novo-Botao 'SAIR' 780 440 80 30 9; $bs.Add_Click({ $f.Close() })

$portas = @(44405, 55962, 55972, 55940, 55920)
$go.Add_Click({
    $go.Enabled = $false; $cbR.Enabled = $false; $cbM.Enabled = $false
    $modo = $listaModo[$cbM.SelectedIndex][0]
    Set-ItemProperty $pref Res $listaRes[$cbR.SelectedIndex]; Set-ItemProperty $pref Modo $modo
    Set-ItemProperty 'HKCU:\Software\Webzen\Mu\Config' BanneDBrilho15 $(if ($ck.Checked) { '1' } else { '0' })
    $script:proc = Start-Process powershell -WindowStyle Hidden -PassThru -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"' + (Join-Path $I 'Abrir-Jogo.ps1') + '"'), '-Modo', $modo
    $script:t0 = Get-Date
    $script:tp = New-Object Windows.Forms.Timer; $script:tp.Interval = 700
    $script:tp.Add_Tick({
        $sql = (Get-Service 'MSSQL$MUBANNEDTEST' -EA 0).Status -eq 'Running'
        $ok = @($portas | ? { Get-NetTCPConnection -LocalPort $_ -State Listen -EA 0 }).Count
        $mu = Get-Process mu -EA 0 | ? { $_.MainWindowHandle -ne [IntPtr]::Zero }
        $n = [int]$sql + $ok + [int][bool]$mu
        $pgf.Width = [int](388 * $n / 7)
        $st.Text = if (-not $sql) { 'Iniciando banco de dados...' } elseif ($ok -lt 5) { "Abrindo servidores ($ok/5)..." } elseif (-not $mu) { 'Abrindo o jogo...' } else { 'Bom jogo!' }
        if ($mu -and ((Get-Date) - $script:t0).TotalSeconds -gt 3) { $script:tp.Stop(); $f.Close() }
        elseif ($script:proc.HasExited -and -not $mu -and ((Get-Date) - $script:t0).TotalSeconds -gt 5) {
            $script:tp.Stop(); $st.Text = 'Falhou ao abrir. Tente de novo.'; $st.ForeColor = [Drawing.Color]::OrangeRed; $go.Enabled = $true; $cbR.Enabled = $true; $cbM.Enabled = $true
        }
    })
    $script:tp.Start()
})
[void]$f.ShowDialog()
