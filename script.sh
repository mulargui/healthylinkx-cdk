
# Absolute path to this repo
SCRIPT=$(readlink -f "$0")
export REPOPATH=$(dirname "$SCRIPT")
echo $REPOPATH
echo $SCRIPT

#cdk bootstrap aws://123456789012/$AWS_REGION --profile prod
