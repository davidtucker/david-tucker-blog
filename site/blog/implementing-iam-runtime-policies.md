---
title: Implementing IAM Runtime Policies
description: Sometimes you need to customize an IAM policy at runtime to create true tenant isolation.  Let's explore why and how you would do that.
date: 2022-01-06
category: Cloud Development
tags:
  - aws
  - aws iam
  - posts
minutes: 8
layout: layouts/post.njk
embedCode: true
---

{% youtube "a5foTVaAkqg" %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget euismod leo. Donec orci tortor, accumsan auctor felis non, ultricies sodales mi. Aliquam eros nisi, porta id erat et, ornare interdum ipsum. Mauris consectetur nibh ac orci fringilla sollicitudin. Nunc rutrum quis est eu fermentum. Nam aliquam facilisis tortor ut finibus. Vestibulum varius lorem ut convallis feugiat. Aenean elit odio, vehicula ac volutpat vel, pellentesque eu nunc. Aliquam ac magna justo.

## Sample Heading

Sed turpis nisl, tempus a vehicula ut, efficitur nec lectus. Maecenas scelerisque eleifend nulla, eget lobortis sem consequat et. In vestibulum ullamcorper massa ac ornare. Suspendisse sed erat consectetur purus pretium imperdiet id in dui. Nunc porttitor et nisl ut vehicula. Proin luctus ultrices arcu nec blandit. Morbi ac ornare tortor. Nam pretium congue leo. Maecenas dictum nisl at elit pharetra venenatis. Praesent egestas quam vel arcu sagittis elementum. Curabitur ac scelerisque augue. In eleifend in risus et molestie. Nam tempor, elit nec tempus tincidunt, enim nisi varius nisl, eget rhoncus nunc mi eget magna.

### Another Heading

Sed nec volutpat leo, id eleifend tortor. Aenean orci massa, bibendum pretium rutrum in, faucibus non orci. Vestibulum semper orci lectus, sit amet tristique orci elementum id. Phasellus aliquam sodales dui, luctus sagittis dolor eleifend id. Integer vel risus posuere, vulputate ipsum at, venenatis justo. Proin condimentum pharetra arcu, pharetra facilisis erat. Vestibulum convallis augue eu pulvinar posuere.

#### Yet Another Heading

Praesent viverra pellentesque erat quis posuere. Sed in dapibus ligula, vitae accumsan diam. Cras leo magna, accumsan a egestas a, suscipit in neque. Nunc lacinia dui eu urna auctor, non feugiat enim sagittis. Praesent quis felis quam. Quisque vulputate magna a imperdiet vulputate. Mauris rutrum hendrerit justo, sit amet iaculis ipsum rhoncus in. Donec et pretium est.

<figure class="dt-code-snippet"><pre class="line-numbers" data-line="">
<code class="language-js">
exports.handler =  async function(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))
  return context.logStreamName
}
</code>
</pre><figcaption>Sample Lambda Invocation</figcaption></figure>

Quisque quis varius erat, ac vestibulum eros. Pellentesque pretium metus vitae elit blandit luctus a ac leo. Proin accumsan tempus bibendum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam urna ligula, efficitur vitae vestibulum suscipit, pulvinar quis sem. Aliquam viverra molestie cursus. Curabitur porttitor sapien eget luctus pulvinar. Nunc pellentesque nibh lobortis nunc consequat lacinia. Maecenas tincidunt dignissim massa id ultrices. In felis ipsum, fermentum in tortor et, dapibus faucibus arcu. Donec odio leo, vestibulum in nibh a, imperdiet dapibus arcu. Etiam eget venenatis ligula. Nunc fringilla erat quis felis ultrices, vel efficitur dui aliquet. Integer nunc lorem, pellentesque a arcu nec, scelerisque luctus quam. Praesent tincidunt pretium ex quis tristique. 
