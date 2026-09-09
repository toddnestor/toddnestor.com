data "aws_secretsmanager_secret_version" "github_token" {
  secret_id = var.github_token_secret_id
}

locals {
  subdomain_prefixes = distinct(concat([""], var.additional_subdomain_prefixes))
}

resource "aws_amplify_app" "this" {
  name       = var.app_name
  repository = var.repository_url

  platform     = "WEB_COMPUTE"
  access_token = data.aws_secretsmanager_secret_version.github_token.secret_string

  environment_variables = var.environment_variables

  dynamic "custom_rule" {
    for_each = var.custom_rules
    content {
      source = custom_rule.value.source
      status = custom_rule.value.status
      target = custom_rule.value.target
    }
  }

  enable_branch_auto_build    = true
  enable_auto_branch_creation = false

  tags = {
    Environment = var.environment
    Project     = var.app_name
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.this.id
  branch_name = var.branch_name

  stage                   = "PRODUCTION"
  framework               = var.framework
  enable_auto_build       = true
  enable_performance_mode = true

  environment_variables = var.environment_variables
}

resource "aws_amplify_branch" "preview" {
  app_id      = aws_amplify_app.this.id
  branch_name = var.preview_branch_name

  stage             = "DEVELOPMENT"
  framework         = var.framework
  enable_auto_build = true
  enable_basic_auth = true
  basic_auth_credentials = base64encode(format(
    "%s:%s",
    var.preview_basic_auth_username,
    var.preview_basic_auth_password,
  ))

  environment_variables = merge(var.environment_variables, {
    SHOW_UNRELEASED = "true"
  })
}

resource "aws_amplify_domain_association" "this" {
  app_id      = aws_amplify_app.this.id
  domain_name = var.domain_name

  certificate_settings {
    type                   = "CUSTOM"
    custom_certificate_arn = aws_acm_certificate.site.arn
  }

  dynamic "sub_domain" {
    for_each = local.subdomain_prefixes
    content {
      branch_name = aws_amplify_branch.main.branch_name
      prefix      = sub_domain.value
    }
  }

  sub_domain {
    branch_name = aws_amplify_branch.preview.branch_name
    prefix      = "preview"
  }

  wait_for_verification = false

  depends_on = [aws_acm_certificate_validation.site]
}
