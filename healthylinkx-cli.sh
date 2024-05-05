#!/usr/bin/env bash

#
# You need to add your AWS credentials before executing this script
# depending on the tool you use you will set some of the following 
# ENV variables (not all needed at the same time)
# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ACCOUNT_ID
# AWS_DEFAULT_REGION, AWS_REGION, AWS_SESSION_TOKEN
#

set -x
export DEBIAN_FRONTEND=noninteractive

# Absolute path to this repo
SCRIPT=$(readlink -f "$0")
#export REPOPATH=$(dirname "$SCRIPT" | sed 's/\/infra//')
export REPOPATH=$(dirname "$SCRIPT")

# check if the image is already built, if not build it
if [ "$(docker images | grep node-image)" == "" ]; then
	docker build --rm=true -t node-image $REPOPATH/docker
fi

# what to do: deploy, interactive (default), bootstrap or destroy
commandline='/bin/bash'

if [ "deploy" == "$1" ]; then 
	commandline='cdk deploy'
fi
if [ "i" == "$1" ]; then 
	commandline='/bin/bash'
fi
if [ "b" == "$1" ]; then 
	commandline='cdk bootstrap'
fi
if [ "destroy" == "$1" ]; then 
	commandline='cdk destroy'
fi

# run the app
#docker run -ti --rm -v $HOME/tmp:/healthylinkx \
docker run -ti --rm -v $REPOPATH:/healthylinkx \
	-w /healthylinkx/ \
	-e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_ACCOUNT_ID \
	-e AWS_REGION -e AWS_DEFAULT_REGION -e AWS_SESSION_TOKEN \
	node-image /bin/bash -c "${commandline}"