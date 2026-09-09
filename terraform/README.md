# OpenTofu Amplify setup for toddnestor.com

Creates a public Route53 hosted zone, ACM cert, Amplify `WEB_COMPUTE` app, and apex/`www`/`preview` aliases.

After the first apply, point the GoDaddy nameservers at `route53_name_servers`, then wait for ACM validation and re-apply if needed.

Push `main` and `preview` before the first Amplify branch attach.
