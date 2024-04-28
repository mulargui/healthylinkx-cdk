
# Absolute path to this repo
SCRIPT=$(readlink -f "$0")
export REPOPATH=$(dirname "$SCRIPT")
echo $REPOPATH
echo $SCRIPT

#cdk init healthylinkx --language typescript
#cdk bootstrap 
#cdk deploy
