---
layout: layouts/post.njk
title: "DevOps Core Tenet: Infrastructure as Code"
author: "David Tucker"
tags:
  - development
  - posts
date: 2016-06-17
description: At its core, an organization that is successful at DevOps is one that has mastered the science of automation. The first core tenet of DevOps is directly connected to this automation process, Infrastructure as Code.
---

At its core, an organization that is successful at DevOps is one that has mastered the science of automation. The first core tenet of DevOps is directly connected to this automation process: Infrastructure as Code.<!--more--> 

In previous generation processes, Infrastructure was managed by manual configurations or snapshots. Over time disparity will arise between development, staging, and production environments. Some configurations were applied to one environment but not another. Despite extensive steps to manage the manual processes between environments, this approach cannot move at the speed needed for today’s organizations.

In today’s rapid innovation climate, successful organizations are treating infrastructure in the same way that they are treating their code. Solutions like Ansible, Terraform, Chef, Puppet, and AWS CloudFormation provide the ability for organizations to maintain every detail about infrastructure in a set of files that can be versioned. In this manner, environments can be provisioned and destroyed as needed with the assurance that each environment which is created with the same code will be identical.

## Benefits

While all of this may sound beneficial in theory, there are three key points that tie this tenet to your overall business goals.

1. **Manual processes around provisioning lengthen your lead time.** In today’s climate, the speed at which an organization can go from idea to implementation is its most important attribute. DevOps as a whole exists to optimize a portion of that pipeline while a holistic agile methodology will optimize the remainder. If there is an extensive manual provisioning process for each new idea, you are increasing your overall lead time and increasing the amount of revenue lost by a slower time to market.
1. **Manual processes around provisioning lead to additional defects.** If a stack cannot be tested in an environment that is identical to production, it may not behave in an identical way once in production. In most cases, organizations see a sharp decrease in the number of defects uncovered in production.
1. **Inconsistencies between environments can lead to uncertainty for issues of performance and scalability.** If you want to accurately plan for how your application can scale, it will require identical environments. Only in this configuration can you effectively load test an experience and have a level of confidence that it will hold up under load in production. Failure to adopt this can lead to costly downtime or subpar performance which leads to decreased user engagement.

## Conclusion

Implementing Infrastructure as Code is an essential step in the DevOps adoption process. While this is a strategic shift for most organizations, it will begin to pay dividends quickly.