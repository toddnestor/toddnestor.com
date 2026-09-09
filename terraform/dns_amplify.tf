locals {
  cloudfront_zone_id = "Z2FDTNDATAQYW2"
}

# Amplify writes www/preview CNAMEs into a new hosted zone. Only the apex
# needs an alias A record (CNAME is not allowed at the zone apex).
resource "aws_route53_record" "amplify_alias" {
  allow_overwrite = true
  zone_id         = aws_route53_zone.this.zone_id
  name            = var.domain_name
  type            = "A"

  alias {
    name = regex(
      "[a-z0-9.-]+\\.cloudfront\\.net",
      one([for sd in aws_amplify_domain_association.this.sub_domain : sd.dns_record if sd.prefix == ""])
    )
    zone_id                = local.cloudfront_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_amplify_domain_association.this]
}
