# Pinnacle Auto Entry
## Background
Ticking boxes in Pinnacle is laborious in the vaccine clinics. This apporach offers a method to automatically tick the boxes.

## How it works
Using software built into windows called "Powershell", you send the computer some very basic code that tells it to mimic somone pressing keys on the keyboard.

## Using it
1. Close as many windows as possible to avoid getting mixed up.
2. Open Pinnacle and navigate to add new vaccination record screen.
3. Select the pre-screener and enter the DOB and NHS number using the QR Code scanner
4. Open up Powershell (Start Menu->Type "Powershell") and paste the code below into it (CTRL+V)
5. Watch as the boxes tick themselves

## Sample Powershell Code
The code below automatically selects that the patient is not a Care Worker/Carer etc. and is "White British". Clearly you need to adjust the boxes if that is not the case.
```vb
Add-Type -AssemblyName System.Windows.Forms;[System.Windows.Forms.SendKeys]::SendWait('%{TAB}');$ws = New-Object -ComObject wscript.shell;sleep -s 1;$ws.SendKeys(" ");sleep -s 4;$ws.SendKeys("{TAB}{TAB} ");sleep -s 1;$ws.SendKeys("{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{LEFT}{TAB}{TAB}{TAB}{LEFT}");sleep -s 1;$ws.SendKeys("{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB} {TAB}{TAB} {TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB}{TAB} {TAB} {TAB} {TAB}{TAB}{TAB} {TAB}{TAB} {TAB} ");
```
### Customising the Code
As Pinnacle changes frequently, this code may need adjusting. The below explains what the lines of code mean so you know what to change.

The first line signals "ALT+TAB" which takes the focus away from Powershell and to the last used window, which should be the browser with Pinnacle open.
```vb
Add-Type -AssemblyName System.Windows.Forms;[System.Windows.Forms.SendKeys]::SendWait('%{TAB}');
```
The next line advises Powershell you want it to start mimicking a keyboard being pressed. This should not be changed.
```vb
$ws = New-Object -ComObject wscript.shell;
```

The next line advises to take a second of delay between key presses. This is useful as Pinnacle sometimes takes a while to load in the next component. It also allows you to see what is happening.
```vb
sleep -s 1;
```

Finally you want to start sending keys. {TAB} does what it says on the tin. When you want to click a button or box, you need to send a space key " ".
```vb
$ws.SendKeys("{TAB}{TAB} ")
```
In the example above, TAB->TAB->SPACE is sent.


