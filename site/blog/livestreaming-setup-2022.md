---
layout: layouts/post.njk
title: "My Livestreaming Setup for 2022"
author: "David Tucker"
tags:
  - video
  - posts
date: 2022-09-15
description: I regularly use my office studio for webinars, livestreams, and even video calls.  I want to walk you through the setup I am currently using.
---

I regularly use my office studio for webinars, livestreams, and even video calls.  I want to walk you through the setup I am currently using. This is one of my two studio areas, and I'll be covering my other studio area in another post.<!--more--> 

![Livestream Studio Image](/images/blog/livestream-2022.jpg)

## Switcher

The core of my setup is the [Blackmagic Design ATEM Mini Extreme ISO video switcher](https://amzn.to/3QN1MBO).  To work alongside my switcher, I utilize the [Blackmagic Smartview](https://amzn.to/3LfEByY) to monitor both my multi-view (which shows the view on all inputs) as well as my current output. To make this work, I have to have two [Blackmagic HDMI to SDI converters](https://amzn.to/3BmVfrQ), since the Smartview accepts SDI inputs.

What I like about this:

* It handles my livestreaming directly.  I don't have to leverage a computer-based solution like OBS. It can livestream to most any platform you would want to stream to.
* This switcher has two USB-C outputs.  I use one for recording to an SSD drive, and the other goes to my computer.  With this, I use the output from the switcher as the webcam on my Mac.
* Since it is the ISO model, it can record all video inputs at 1080p. In this way, I can go back and edit my software demos after the fact.
* It knows how to talk to my Blackmagic cameras, so I can control color correction, focus, and even camera recording directly from the switcher.
* I program macros for the video switcher in XML.  This enables me to kickoff an entire livestream at the push of a single button.  The streaming, recording, countdown video, etc... all happens with one of these macros.

## Audio

My audio chain has several elements to it. There are some things I would change with this, which I'll explain below, but overall I am very happy with the sound from the setup.

Here is my audio signal chain:

* [Shure SM7-B Microphone](https://amzn.to/3dkORJV)
* [Cloud Lifter](https://amzn.to/3QG7mpK): The output from the SM7-B is very low, and the Cloud Lifter raises the output volume without adding much noise.
* [SPL Track One Channel Strip](https://www.guitarcenter.com/SPL/Track-One-2960-1500000331196.gc?cntry=us&source=4WWRWXGP&gclid=Cj0KCQjwmouZBhDSARIsALYcourqoK6IdHxuwuEowKqEf_T8c0LGPYR9TvDPba2jAVPrtZMkiwaBL9QaAoENEALw_wcB)
* [Focusrite 18i20 3rd Gen](https://amzn.to/3DxY9gt): If I record just a voiceover, I'll use the direct connection to this audio interface.
* [ATEM Mini Extreme ISO](https://amzn.to/3QN1MBO): If I'm doing a livestream or webcam setup, I'll use the audio feed that routes through the ATEM Mini. I utilize the frame delay on the switcher to make sure the audio and video are perfectly in sync. Mine is delayed by 2 frames to make sure that sync is right.

I'll likely simplify this signal chain, as it has a few too many elements. 

## Cameras

I utilize two [Blackmagic Pocket Cinema Camera 4K's](https://amzn.to/3qZo3Cl) in this space. These both have the [Lumix 12-35mm](https://amzn.to/3eTTACA) lens. They connect directly to the switcher via HDMI, and the switcher knows how to control several aspects of these cameras directly. 

![Dual Camera Views](/images/blog/dual-camera-views.jpg)

## Lighting

The lighting that I use in this space is lower quality than what I use in my more formal studio space. This is primarily due to the space available in the room.  I simply couldn't fit a giant softbox in my office area.  

I utilize two [Elgato Key Light Air's](https://amzn.to/3LwB4wF). I also have a few different accent lighr options. I utilize an [Aputure B7C](https://amzn.to/3Dt6Qs3) for the lamp on the table behind me along with some various rope lights. 

## Video Playback

I also utilize a video playback device for lower third videos, intro and outro videos, and a few other elements. The particular device I use is the [Blackmagic Design Hyperdeck Mini](https://amzn.to/3qIUjcs). This device also works well with the macros I have programmed for the video switcher.

## Conclusion

This is just a quick equipment overview. I plan to release additional information in the near future on how I actually utilize this during a livestream episode.