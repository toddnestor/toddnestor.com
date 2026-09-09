output "amplify_app_id" {
  value = aws_amplify_app.this.id
}

output "amplify_default_domain" {
  value = aws_amplify_app.this.default_domain
}

output "custom_domain" {
  value = var.domain_name
}

output "preview_custom_domain" {
  value = "preview.${var.domain_name}"
}

output "route53_zone_id" {
  value = aws_route53_zone.this.zone_id
}

output "route53_name_servers" {
  value = aws_route53_zone.this.name_servers
}

output "acm_certificate_arn" {
  value = aws_acm_certificate.site.arn
}
