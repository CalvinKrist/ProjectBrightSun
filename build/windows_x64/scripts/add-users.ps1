# Script to add users to a computer with variety of options
# Using net user commands for backwards compatability
# CREATE USER
<#
/active:yes/no - enable/disable user account
/passwordchg:yes/no - user can/cannot change password
/comment:"Text" - set description of user
/fullname:"Name" - set full name of user
/random - give the user a random password
#>
#Example: net user /add username Password

# ADD USER TO GROUPS
#net localgroup group_name user_name /add

$user_config_file = Get-Content -Path "A:\local_users.json" -Raw

$users_json = $user_config_file | ConvertFrom-Json
ForEach($user in ($users_json | select -expand local_users)) {
    $add_cmd = "net user /add $($user.username) "
    if($user.random -eq $true) {
        $add_cmd += "/random "
    } else {
        $add_cmd += "$($user.password) "
    }
    if($user.active -eq $true) {
        $add_cmd += "/active:yes "
    } else {
        $add_cmd += "/active:no "
    }
    if($user.passwordchg -eq $true) {
        $add_cmd += "/passwordchg:yes "
    } else {
        $add_cmd += "/passwordchg:no "
    }
    $add_cmd += "/comment:`"$($user.comment)`" "
    $add_cmd += "/fullname:`"$($user.fullname)`" "
    iex $add_cmd

    ForEach($group in $user.groups) {
        iex "net localgroup `"$group`" $($user.username) /add"
    }
}

