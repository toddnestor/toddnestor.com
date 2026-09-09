variable "aws_region" {
  description = "AWS region for Amplify resources."
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "Optional AWS CLI profile name."
  type        = string
  default     = null
}

variable "environment" {
  description = "Environment name (e.g. production, staging)."
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Amplify app name."
  type        = string
  default     = "toddnestor"
}

variable "repository_url" {
  description = "Git repository URL for the app source."
  type        = string
}

variable "branch_name" {
  description = "Branch Amplify should build/deploy."
  type        = string
  default     = "main"
}

variable "domain_name" {
  description = "Root domain to attach to Amplify."
  type        = string
  default     = "toddnestor.com"
}

variable "additional_subdomain_prefixes" {
  description = "Additional subdomains mapped to the production branch (e.g. [\"www\"]). Do not include \"preview\"."
  type        = list(string)
  default     = ["www"]
}

variable "preview_branch_name" {
  description = "Git branch Amplify should build for the passworded preview site."
  type        = string
  default     = "preview"
}

variable "preview_basic_auth_username" {
  description = "HTTP basic auth username for the preview hostname."
  type        = string
  default     = "preview"
}

variable "preview_basic_auth_password" {
  description = "HTTP basic auth password for the preview hostname. Do not commit the real value."
  type        = string
  sensitive   = true
}

variable "framework" {
  description = "Amplify framework hint."
  type        = string
  default     = "Next.js - SSR"
}

variable "github_token_secret_id" {
  description = "Secrets Manager secret ID that stores a GitHub access token."
  type        = string
  default     = "github/personal-access-token"
}

variable "environment_variables" {
  description = "Amplify app/branch environment variables."
  type        = map(string)
  default     = {}
}

variable "custom_rules" {
  description = "Optional Amplify rewrite/redirect rules."
  type = list(object({
    source = string
    status = string
    target = string
  }))
  default = []
}
