# Script to enable select windows components
# Using dism for maximum compatibility, see https://peter.hahndorf.eu/blog/WindowsFeatureViaCmd.html

#$ScriptDir = Split-Path -parent $MyInvocation.MyCommand.Path
#$features_config_file = Get-Content -Path "$ScriptDir\..\configs\windows_optional_features.json" -Raw

$features_config_file = Get-Content -Path "A:\windows_optional_features.json" -Raw

$features_json = $features_config_file | ConvertFrom-Json

ForEach($feature in ($features_json | select -expand features)) {
    $enable_cmd = "Dism /online /Enable-Feature /FeatureName:`"$feature`""
    if([Environment]::OSVersion.Version -ge (new-object 'Version' 6,2)) {
        $enable_cmd += " /All"
    }
    iex $enable_cmd
}