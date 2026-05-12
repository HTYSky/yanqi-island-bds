@echo off
if not exist .Release (
    mkdir .Release
) 
if exist manifest.json (
    move manifest.json .Release
    echo [32;40mEnabled Plugin![0m
    ren .DisabledPlugin.bat .EnabledPlugin.bat
) else (
    move .\.Release\manifest.json .\
    echo [32;40mDisabled Plugin[0m
    ren .EnabledPlugin.bat .DisabledPlugin.bat
)
