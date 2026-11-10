param([int]$MuPid, [string]$Pasta)
# Captura a tecla Print enquanto o MU roda: o mu.exe fecha sozinho ao receber Print.
# Salva a tela inteira em PNG na pasta ScreenShots do cliente e nao repassa a tecla ao jogo.
Add-Type -AssemblyName System.Windows.Forms, System.Drawing
Add-Type -ReferencedAssemblies System.Windows.Forms, System.Drawing -TypeDefinition @'
using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Windows.Forms;
public static class MuPrint {
    delegate IntPtr Proc(int code, IntPtr w, IntPtr l);
    [DllImport("user32.dll")] static extern IntPtr SetWindowsHookEx(int id, Proc p, IntPtr mod, uint tid);
    [DllImport("user32.dll")] static extern IntPtr CallNextHookEx(IntPtr h, int c, IntPtr w, IntPtr l);
    [DllImport("kernel32.dll")] static extern IntPtr GetModuleHandle(string n);
    static Proc proc = Hook; static IntPtr hook; static string pasta; static Process mu;
    public static void Run(int pid, string dir) {
        pasta = dir; mu = Achar(pid); int vazio = 0;
        hook = SetWindowsHookEx(13, proc, GetModuleHandle(null), 0);
        var t = new Timer(); t.Interval = 2000; t.Tick += (s, e) => { if (mu == null || mu.HasExited) { mu = Achar(0); vazio = mu == null ? vazio + 1 : 0; if (vazio > 15) Application.Exit(); } }; t.Start();
        Application.Run();
    }
    static Process Achar(int pid) { try { if (pid > 0) return Process.GetProcessById(pid); } catch { } var l = Process.GetProcessesByName("mu"); return l.Length > 0 ? l[0] : null; }
    static IntPtr Hook(int code, IntPtr w, IntPtr l) {
        if (code >= 0 && Marshal.ReadInt32(l) == 0x2C) {
            if ((int)w == 0x100 || (int)w == 0x104) { var ts = new Timer(); ts.Interval = 50; ts.Tick += (a, b) => { ts.Stop(); ts.Dispose(); Save(); }; ts.Start(); }
            return (IntPtr)1; // o mu.exe fecha se receber Print: a tecla nao chega ao jogo
        }
        // Alt+F4 com o MU em primeiro plano: fecha o jogo (o mu.exe ignora sozinho)
        if (code >= 0 && Marshal.ReadInt32(l) == 0x73 && (Marshal.ReadInt32(l, 8) & 0x20) != 0 && (int)w == 0x104 && MuNaFrente()) {
            try { mu.CloseMainWindow(); } catch { }
            var t = new Timer(); t.Interval = 2500; t.Tick += (s, e) => { t.Stop(); try { if (!mu.HasExited) mu.Kill(); } catch { } }; t.Start();
            return (IntPtr)1;
        }
        return CallNextHookEx(hook, code, w, l);
    }
    [DllImport("user32.dll")] static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
    static bool MuNaFrente() { uint p; GetWindowThreadProcessId(GetForegroundWindow(), out p); return mu != null && p == (uint)mu.Id; }
    static void Save() {
        try {
            var r = Screen.PrimaryScreen.Bounds;
            using (var b = new Bitmap(r.Width, r.Height)) {
                using (var g = Graphics.FromImage(b)) g.CopyFromScreen(r.Location, Point.Empty, r.Size);
                System.IO.Directory.CreateDirectory(pasta);
                b.Save(System.IO.Path.Combine(pasta, "MuBanneD_" + DateTime.Now.ToString("yyyyMMdd_HHmmss_fff") + ".png"), ImageFormat.Png);
                Clipboard.SetImage(b);
            }
        } catch { }
    }
}
'@
[MuPrint]::Run($MuPid, $Pasta)
