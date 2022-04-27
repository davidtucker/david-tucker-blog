---
layout: layouts/post.njk
title: "DevOps 101: Continuous Delivery"
author: "David Tucker"
tags:
  - development
  - posts
date: 2016-06-01
description: DevOps is a set of best practices for collaboration and coordination between development and operations to enable continuous delivery. What is continuous delivery?  I'm glad you asked.
---

DevOps is a set of best practices for collaboration and coordination between development and operations to enable continuous delivery. What is continuous delivery?  I'm glad you asked.<!--more-->

## Understanding the Terms

When we discuss build and deployment methodologies, there are a few key terms to understand:

**Continuous Integration (CI)** is a software development methodology in which you build and test software with every code commit. CI provides Agile teams with instant feedback, facilitating the resolution of many issues prior to a release.

**Continuous Delivery (CD)** is a software development practice that facilitates a repeatable and reliable process for quality software release. CD is characterized as continuous integration, automated testing and automated deployment capabilities functioning together. In this approach, every commit to the development branch is available to release. However, in this methodology, there is a release management team which decides when a release will be made available to users.

**Continuous Deployment** is a methodology that is often confused for Continuous Delivery. With Continuous Deployment, code is built, tested, and deployed with every commit (or with every few commits). This is the methodology embraced by many tech startups.

Hopefully, our definition of DevOps makes more sense given this understanding. We believe that every organization that delivers software should be moving toward a Continuous Delivery methodology.

## Continuous Delivery Workflow

To better understand Continuous Delivery, it is important to understand a sample implementation of it in practice. The image below details this workflow:

![A Sample Continuous Delivery Workflow](img/devops-continuous-delivery.jpg)

The action that kicks off this workflow is a commit from a developer on one of the development teams. This kicks off the continuous integration phase. This is usually facilitated by a Continuous Integration server such as Jenkins, Bamboo, TeamCity or a service such as TravisCI, CircleCI, or Codeship. At this point, the CI server will execute a set of tests such as unit tests, syntax tests, and validation.

The action which initiates the second and third phase is the creation of a build. This may be a manual process such as creating a build to deploy a set of functionality for acceptance testing or an automated process such as creating a daily build at a specified time. In many cases, this process happens on the same CI server that was used in phase 1. The second phase in this process is the build phase. A build server will take the application as a whole at the current state and run the testing from phase 1 as well as security testing. If this holistic testing and validation passes, then the build is ready to be pushed to the testing environment.

The third phase is initiated automatically after a successful build on the build server. The infrastructure creation process is automated and a new environment is launched and the code deployed onto this environment. After this, automated integration, functional, and smoke tests are executed on this environment. Since we are holding to the DevOps core tenets, and all environment creation is scripted on dynamic infrastructure, we can be assured that this environment is identical to production. The testing environment will communicate and let the release management team know if all tests passed for the build.

If the team is satisfied with the build, they can decide to create a release. Upon creating a release, a new environment is created, the application is deployed and smoke testing takes place. The team can choose to validate anything else at this point. In some cases, there may be some manual validation that occurs. Finally, if the team decides to deploy to users, the production traffic can be re-routed to the new environment.

While this is just a sample continuous delivery workflow, it illustrates how the DevOps core tenets align with technical best practices to create an efficient workflow to deliver value to your end users. Every organization will need to have a workflow created that matches their specific approach.

## Why Continuous Delivery?

While all of these concepts may seem beneficial, they certainly have a cost associated with them. To understand why your organization should invest in this methodology, it is important to grasp the two main reasons that organizations make this shift:

**Continuous Delivery eliminates many of the steps that create excessive lead time for organizations.** In today’s environment, organizations succeed or fail based on the amount of time it takes them to deliver value to their end users. Monolithic long-term release cycles simply do not work in today’s environment. Organizations need to be able to deliver value in a matter of weeks instead of months. Optimizing the process of delivering this value is one of the most important things an organization can do.

**Decreasing the variability in the development process will reduce the maintenance burden in the long term.** Unfortunately so much of the development and deployment process is manual for most organizations. Whether instance creation, regression testing, or pushing to production, organizations are introducing variability into their process. By maximizing automation within the process, problems are found earlier and overall defects that make it to end users are drastically decreased. In most all cases, this decreases the amount of time maintaining past releases so that organizations can focus on delivering new value.
Conclusion

Continuous Delivery is so important to us at Universal Mind, that is in our very definition of DevOps. Since we believe in aligning any organization around delivering value to end users, we believe that a DevOps culture is one of the best ways to make that happen. For many organizations, a DevOps assessment can help them make the first step to creating the culture that allows for this type of innovation.