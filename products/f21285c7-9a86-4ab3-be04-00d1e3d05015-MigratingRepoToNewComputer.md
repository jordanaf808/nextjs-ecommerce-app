# Migrating SimpleHuman Repo from Intel to M1

---

Instructions from [Migrate from Intel to ARM brew on M1 #417](https://github.com/orgs/Homebrew/discussions/417#discussioncomment-2556937):

## You can copy and paste into the Terminal

## Go to home directory
cd ;

## Create list of installed Intel packages
brew bundle dump ;

## Install new version of Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)" ;

## Update the PATH to point to M1 version first
eval "$(/opt/homebrew/bin/brew shellenv)" ;
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc ;

## Migrate Intel packages (/usr/local/bin/brew) to M1 (/opt/Homebrew)
## You may need to enter your sysadmin password
brew bundle --file Brewfile ;

## Update packages
brew update ; 

## Upgrade packages
brew upgrade ;

## Clean up
brew cleanup ;

## Uninstall old Intel version

## Download uninstall script
curl -fsSL -o ./uninstall.sh https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh ;

## Run the uninstall specifying the old path
sudo /bin/bash ./uninstall.sh --path=/usr/local ;
## Enter password
## Type Y to uninstall

## Delete uninstall script
rm uninstall.sh ;

## Final cleanup
brew cleanup ;

---

> output from uninstall script

```zsh
sudo /bin/bash ./uninstall.sh --path=/usr/local
Password:
Warning: This script will remove:
/Users/jordan/Library/Caches/Homebrew/
/Users/jordan/Library/Logs/Homebrew/
/usr/local/Cellar/
/usr/local/bin/brew -> /usr/local/bin/brew
Are you sure you want to uninstall Homebrew? This will remove your installed packages! [y/N] y
==> Removing Homebrew installation...
==> Removing empty directories...
==> /usr/bin/sudo /usr/bin/find /usr/local/bin /usr/local/etc /usr/local/include /usr/local/lib /usr/local/opt /usr/local/sbin /usr/local/share /usr/local/var /usr/local/Homebrew /usr/local/Frameworks -name .DS_Store -delete
==> /usr/bin/sudo /usr/bin/find /usr/local/bin /usr/local/etc /usr/local/include /usr/local/lib /usr/local/opt /usr/local/sbin /usr/local/share /usr/local/var /usr/local/Homebrew /usr/local/Frameworks -depth -type d -empty -exec rmdir {} ;
==> /usr/bin/sudo rmdir /usr/local
rmdir: /usr/local: Operation not permitted
Warning: Failed during: /usr/bin/sudo rmdir /usr/local
Warning: Homebrew partially uninstalled (but there were steps that failed)!
To finish uninstalling rerun this script with `sudo`.
The following possible Homebrew files were not deleted:
/usr/local/.com.apple.installer.keep
/usr/local/Frameworks/
/usr/local/Homebrew/
/usr/local/bin/
/usr/local/etc/
/usr/local/include/
/usr/local/lib/
/usr/local/opt/
/usr/local/sbin/
/usr/local/share/
/usr/local/var/
You may wish to remove them yourself.
```