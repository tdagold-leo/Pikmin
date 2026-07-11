using System;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.Threading;
using System.Windows.Forms;

public class LinePaster
{
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll", SetLastError = true)]
    static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

    [STAThread]
    public static void Main(string[] args)
    {
        if (args.Length == 0) return;
        string text = args[0];

        // 重試設定剪貼簿，避免被其他程式鎖定
        for (int i = 0; i < 5; i++)
        {
            try
            {
                Clipboard.SetText(text);
                break;
            }
            catch
            {
                Thread.Sleep(100);
            }
        }

        // 倒數 3 秒，讓使用者自己點擊 LINE 視窗
        Thread.Sleep(3000);
        
        // 有些 Qt 程式吃不到 ^v，改送 Shift+Insert 試試看
        SendKeys.SendWait("+{INS}");
        Thread.Sleep(500);
        
        // 再保險一點，送出 Enter 前確保有停頓
        SendKeys.SendWait("{ENTER}");
    }
}
