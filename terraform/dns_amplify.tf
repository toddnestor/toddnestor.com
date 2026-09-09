locals {
  cloudfront_zone_id = "Z2FDTNDATAQYW2"
  amplify_dns_prefixes = {
    for p in distinct(concat([""], var.additional_subdomain_prefixes, ["preview"])) : p => true
  }
}

resource "aws_route53_record" "amplify_alias" {
  for_each = local.amplify_dns_prefixes

  allow_overwrite = true
  zone_id         = aws_route53_zone.this.zone_id
  name            = each.key == "" ? var.domain_name : "${each.key}.${var.domain_name}"
  type            = "A"

  alias {
    name = regex(
      "[a-z0-9.-]+\\.cloudfront\\.net",
      one([for sd in aws_amplify_domain_association.this.sub_domain : sd.dns_record if sd.prefix == each.key])
    )
    zone_id                = local.cloudfront_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_amplify_domain_association.this]
}
