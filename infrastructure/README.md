# Vestry Infrastructure

This stack defines the infrastructure on AWS using the Cloud Development Kit (CDK).

## Account Structure



## Bootstrapping

For the environments to work, they need to be bootstrapped. This process handles the bootstrapping as well as creating the trust relationship from the shared services account to the actual environment accounts.  Here is an example of this (that I performed for the current staging and production accounts):

```
env CDK_NEW_BOOTSTRAP=1 npx cdk bootstrap \
  --profile vestry_shared \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
  aws://242418079756/us-east-2

# Staging - us-east-2
env CDK_NEW_BOOTSTRAP=1 npx cdk bootstrap -c env=staging \
  --profile vestry_dev_tucker \
  --trust 242418079756 \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
  aws://236297860667/us-east-2

# Staging - us-east-1
env CDK_NEW_BOOTSTRAP=1 npx cdk bootstrap -c env=staging \
  --profile vestry_dev_tucker \
  --trust 242418079756 \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
  aws://236297860667/us-east-1

# Production - us-east-2
npx cdk bootstrap -c env=staging \
  --profile vestry_production \
  --trust 242418079756 \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
  aws://704452488003/us-east-2

# Production us-east-1
npx cdk bootstrap -c env=staging \
  --profile vestry_production \
  --trust 242418079756 \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
  aws://704452488003/us-east-1
```
