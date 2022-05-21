#!/bin/bash

ssh -i ~/.ssh/herethere_bastion.pem -N \
-L 3306:herethere-db.cpa5vrpp0xfm.ap-northeast-2.rds.amazonaws.com:3306 \
-p 22 ubuntu@ec2-3-36-77-217.ap-northeast-2.compute.amazonaws.com
