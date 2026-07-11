Set WshShell = WScript.CreateObject("WScript.Shell")
If WScript.Arguments.Count > 0 Then
    text = WScript.Arguments(0)
    
    ' Set clipboard (using IE or just assume text is small and we type it?)
    ' Wait, VBS doesn't have native clipboard setting. We can just SendKeys the text directly!
    ' But text has '@'. SendKeys handles '@' fine.
    
    WshShell.AppActivate "LINE"
    WScript.Sleep 1000
    WshShell.SendKeys text
    WScript.Sleep 200
    WshShell.SendKeys "{ENTER}"
End If
