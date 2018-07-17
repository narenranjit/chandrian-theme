# Path to your oh-my-zsh configuration.
ZSH=$HOME/.oh-my-zsh

ZSH_CUSTOM=~/dotfiles/zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
ZSH_THEME="lightning-git"

# Example aliases
ZSH_HIGHLIGHT_HIGHLIGHTERS=(main brackets pattern cursor)
# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Comment this out to disable bi-weekly auto-update checks
# DISABLE_AUTO_UPDATE="true"

# Uncomment to change how many often would you like to wait before auto-updates occur? (in days)
# export UPDATE_ZSH_DAYS=13

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
# COMPLETION_WAITING_DOTS="true"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(per-directory-history zsh-autosuggestions zsh-syntax-highlighting)

source $ZSH/oh-my-zsh.sh
source ~/dotfiles/osx/iterm2/colorize-ssh-tab.zsh

eval "$(fasd --init auto)"

alias o='a -e open'
alias gfunctions='/usr/local/lib/node_modules/@google-cloud/functions-emulator/bin/functions'

# alias subl='f -e sublime'
alias ni='npm install -D'
alias gs='gitsh --git $(which hub)'
alias F='~/FPrjs/forio-cli/index.coffee'

prj() { mkdir $1 && cd $1 && git setup && subl . }
mcd() { mkdir $1 && cd $1; }
gcd() { git clone $1 && cd $1; }

# https://gist.github.com/phette23/5270658 set iterm title to dir name
if [ $ITERM_SESSION_ID ]; then
  DISABLE_AUTO_TITLE="true"
  echo -ne "\033];${PWD##*/}\007"
fi
precmd() {
  echo -ne "\033];${PWD##*/}\007"
}

# Customize to your needs...
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/share/python:/usr/local/share/dotnet
ACKRC="~/dotfiles/.ackrc"

test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

loadnvm() {
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
    echo "nvm loaded"
}
# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/narenranjit/google-cloud-sdk/path.zsh.inc' ]; then source '/Users/narenranjit/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/narenranjit/google-cloud-sdk/completion.zsh.inc' ]; then source '/Users/narenranjit/google-cloud-sdk/completion.zsh.inc'; fi
