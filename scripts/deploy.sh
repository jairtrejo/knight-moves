#!/usr/bin/env bash

npm run build
aws s3 sync --acl private build s3://www.funnyhowtheknightmoves.com --delete --cache-control max-age=31536000,public
aws s3 cp s3://www.funnyhowtheknightmoves.com/index.html s3://www.funnyhowtheknightmoves.com/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl private
