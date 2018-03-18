# Script to add users to a computer with variety of options
# Using net user commands for backwards compatability all the way back

# CREATE USER
<#
/active:yes/no - enable/disable user account
/passwordchg:yes/no - user can/cannot change password
/domain - add to domain, not locally
/comment:"Text" - set description of user
/fullname:"Name" - set full name of user
/random - give the user a random password
#>
net user /add username Password
#wmic useraccount where "name='developer'" set PasswordExpires=false

# ADD USER TO GROUPS
#net localgroup group_name developer /add